import Repository from "../models/Repository.js";
import Commit from "../models/Commit.js";
import Contributor from "../models/Contributor.js";
import SavedAnalysis from "../models/SavedAnalysis.js";
import User from "../models/User.js";
import { parseRepoUrl } from "../utils/parseRepoUrl.js";
import * as github from "../services/githubService.js";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — repo metadata is cheap to refresh

// When the request carries a logged-in user (via optionalAuth/protect), use
// *their* GitHub token so they can analyze their own private repos. Falls
// back to the app-level GITHUB_TOKEN inside githubService when this is undefined.
async function getUserToken(req) {
  if (!req.user) return undefined;
  const user = await User.findById(req.user.id).select("+githubAccessToken");
  return user?.githubAccessToken;
}

async function upsertRepository(owner, repo, token) {
  const meta = await github.fetchRepository(owner, repo, token);
  const languages = await github.fetchLanguages(owner, repo, token);

  const doc = await Repository.findOneAndUpdate(
    { owner: meta.owner, name: meta.name },
    { ...meta, languages, lastSyncedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return doc;
}

async function upsertContributors(repositoryId, owner, repo, token) {
  const contributors = await github.fetchContributors(owner, repo, token);
  await Promise.all(
    contributors.map((c) =>
      Contributor.findOneAndUpdate(
        { repositoryId, username: c.username },
        { ...c, repositoryId },
        { upsert: true }
      )
    )
  );
  return contributors;
}

async function upsertCommits(repositoryId, owner, repo, { since, token } = {}) {
  let page = 1;
  let allFetched = [];
  // Pull up to 5 pages (500 commits) on first sync to keep this responsive;
  // fuller history can be pulled in by calling /sync repeatedly.
  while (page <= 5) {
    const batch = await github.fetchCommits(owner, repo, { since, page, token });
    if (!batch.length) break;
    allFetched = allFetched.concat(batch);
    if (batch.length < 100) break;
    page += 1;
  }

  await Promise.all(
    allFetched.map((c) =>
      Commit.findOneAndUpdate(
        { repositoryId, sha: c.sha },
        { ...c, repositoryId },
        { upsert: true }
      )
    )
  );

  if (allFetched.length) {
    await Repository.findByIdAndUpdate(repositoryId, {
      lastSyncedCommitSha: allFetched[0].sha,
      lastSyncedAt: new Date(),
    });
  }

  return allFetched.length;
}

// POST /api/repos/analyze
// req.user is set by optionalAuth when a valid token is present — logged-in
// users get this saved to their "Saved Analyses"; anonymous users just get
// the cached repository data back.
export const analyzeRepository = async (req, res, next) => {
  try {
    const { repoUrl } = req.body;
    const { owner, repo } = parseRepoUrl(repoUrl);
    const token = await getUserToken(req);

    const repository = await upsertRepository(owner, repo, token);
    await upsertContributors(repository._id, owner, repo, token);
    await upsertCommits(repository._id, owner, repo, { token });

    if (!repository.analyzedBy && req.user) {
      repository.analyzedBy = req.user.id;
      await repository.save();
    }

    if (req.user) {
      await SavedAnalysis.findOneAndUpdate(
        { userId: req.user.id, repositoryId: repository._id },
        { userId: req.user.id, repositoryId: repository._id, savedAt: new Date() },
        { upsert: true }
      );
    }

    res.status(200).json({ success: true, data: repository });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos — current user's saved analyses
export const getSavedRepositories = async (req, res, next) => {
  try {
    const saved = await SavedAnalysis.find({ userId: req.user.id })
      .sort({ savedAt: -1 })
      .populate("repositoryId");

    const data = await Promise.all(
      saved
        .filter((s) => s.repositoryId) // guard against orphaned refs
        .map(async (s) => {
          const [commitCount, contributorCount] = await Promise.all([
            Commit.countDocuments({ repositoryId: s.repositoryId._id }),
            Contributor.countDocuments({ repositoryId: s.repositoryId._id }),
          ]);
          return {
            savedAnalysisId: s._id,
            savedAt: s.savedAt,
            repository: { ...s.repositoryId.toObject(), commitCount, contributorCount },
          };
        })
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/repos/:id — remove repository id from current user's saved list
// (does not delete the underlying cached repo/commit data other users may share)
export const removeSavedRepository = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SavedAnalysis.findOneAndDelete({
      userId: req.user.id,
      repositoryId: id,
    });
    if (!result) {
      const e = new Error("Saved analysis not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ success: true, message: "Removed from saved analyses" });
  } catch (err) {
    next(err);
  }
};

async function getOrRefreshRepository(owner, repo, token) {
  let repository = await Repository.findOne({ owner, name: repo });
  const isStale =
    !repository ||
    Date.now() - new Date(repository.lastSyncedAt || 0).getTime() > CACHE_TTL_MS;

  if (isStale) {
    repository = await upsertRepository(owner, repo, token);
    if (!(await Contributor.exists({ repositoryId: repository._id }))) {
      await upsertContributors(repository._id, owner, repo, token);
    }
    if (!(await Commit.exists({ repositoryId: repository._id }))) {
      await upsertCommits(repository._id, owner, repo, { token });
    }
  }
  return repository;
}

// GET /api/repos/:owner/:repo
export const getRepository = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const [commitCount, contributorCount] = await Promise.all([
      Commit.countDocuments({ repositoryId: repository._id }),
      Contributor.countDocuments({ repositoryId: repository._id }),
    ]);
    res.json({
      success: true,
      data: { ...repository.toObject(), commitCount, contributorCount },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/commits?author=&since=&until=&page=
export const getCommits = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { author, since, until, page = 1, limit = 30 } = req.query;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const filter = { repositoryId: repository._id };
    if (author) filter.authorLogin = author;
    if (since || until) {
      filter.date = {};
      if (since) filter.date.$gte = new Date(since);
      if (until) filter.date.$lte = new Date(until);
    }

    const commits = await Commit.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Commit.countDocuments(filter);

    res.json({ success: true, data: commits, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/commits/:sha
export const getCommitDetail = async (req, res, next) => {
  try {
    const { owner, repo, sha } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);

    let commit = await Commit.findOne({ repositoryId: repository._id, sha });
    if (!commit || !commit.filesChanged?.length) {
      const detail = await github.fetchCommitDetail(owner, repo, sha, token);
      commit = await Commit.findOneAndUpdate(
        { repositoryId: repository._id, sha },
        { ...detail, repositoryId: repository._id },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, data: commit });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/contributors
export const getContributors = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const contributors = await Contributor.find({
      repositoryId: repository._id,
    }).sort({ contributions: -1 });
    res.json({ success: true, data: contributors });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/languages
export const getLanguages = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const languages = Object.fromEntries(repository.languages || new Map());
    const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
    const percentages = Object.fromEntries(
      Object.entries(languages).map(([lang, bytes]) => [
        lang,
        Number(((bytes / total) * 100).toFixed(1)),
      ])
    );
    res.json({ success: true, data: percentages });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/timeline  — derived from tagged releases
export const getTimeline = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);

    // Group commits by month as a lightweight, dependable "milestone" view
    // (works even for repos with no tags/releases).
    const commits = await Commit.find({ repositoryId: repository._id }).sort({
      date: 1,
    });

    const buckets = {};
    for (const c of commits) {
      const key = new Date(c.date).toISOString().slice(0, 7); // YYYY-MM
      buckets[key] = buckets[key] || { month: key, commitCount: 0, authors: new Set() };
      buckets[key].commitCount += 1;
      buckets[key].authors.add(c.authorLogin || c.authorName);
    }

    const timeline = Object.values(buckets).map((b) => ({
      month: b.month,
      commitCount: b.commitCount,
      activeContributors: b.authors.size,
    }));

    res.json({ success: true, data: timeline });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const commits = await Commit.find({ repositoryId: repository._id }).sort({
      date: 1,
    });

    const commitsOverTime = {};
    const additionsDeletions = {};
    const contributorActivity = {};

    for (const c of commits) {
      const key = new Date(c.date).toISOString().slice(0, 10);
      commitsOverTime[key] = (commitsOverTime[key] || 0) + 1;

      additionsDeletions[key] = additionsDeletions[key] || {
        additions: 0,
        deletions: 0,
      };
      additionsDeletions[key].additions += c.additions || 0;
      additionsDeletions[key].deletions += c.deletions || 0;

      const author = c.authorLogin || c.authorName || "unknown";
      contributorActivity[author] = (contributorActivity[author] || 0) + 1;
    }

    res.json({
      success: true,
      data: {
        commitsOverTime: Object.entries(commitsOverTime).map(([date, count]) => ({
          date,
          count,
        })),
        additionsDeletions: Object.entries(additionsDeletions).map(
          ([date, v]) => ({ date, ...v })
        ),
        contributorActivity: Object.entries(contributorActivity)
          .map(([author, commits]) => ({ author, commits }))
          .sort((a, b) => b.commits - a.commits),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/heatmap
export const getHeatmap = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const commits = await Commit.find({ repositoryId: repository._id });

    // 7 days x 24 hours grid
    const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const c of commits) {
      const d = new Date(c.date);
      grid[d.getUTCDay()][d.getUTCHours()] += 1;
    }

    res.json({ success: true, data: grid });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/snapshot?date=YYYY-MM-DD  — "time travel"
export const getSnapshot = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { date } = req.query;
    if (!date) {
      const e = new Error("Query param 'date' is required (YYYY-MM-DD)");
      e.statusCode = 400;
      throw e;
    }

    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const isoDate = new Date(date).toISOString();

    const commitAtDate = await github.fetchCommitAtDate(owner, repo, isoDate, token);
    if (!commitAtDate) {
      return res.json({
        success: true,
        data: { date, message: "No commits found before this date" },
      });
    }

    const tree = await github.fetchTreeAtRef(owner, repo, commitAtDate.sha, token);
    const fileCount = tree.filter((t) => t.type === "blob").length;

    const commitsBefore = await Commit.find({
      repositoryId: repository._id,
      date: { $lte: new Date(date) },
    });
    const contributorSet = new Set(
      commitsBefore.map((c) => c.authorLogin || c.authorName)
    );

    res.json({
      success: true,
      data: {
        date,
        commitSha: commitAtDate.sha,
        files: fileCount,
        contributors: contributorSet.size,
        commits: commitsBefore.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/files  — file tree at HEAD (default branch)
export const getFileTree = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);
    const tree = await github.fetchTreeAtRef(
      owner,
      repo,
      repository.defaultBranch || "main",
      token
    );
    res.json({ success: true, data: tree });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/files/history?path=src/App.jsx  — Phase 11
export const getFileHistory = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { path } = req.query;
    if (!path) {
      const e = new Error("Query param 'path' is required");
      e.statusCode = 400;
      throw e;
    }

    const token = await getUserToken(req);
    const history = await github.fetchFileHistory(owner, repo, path, token);
    if (!history.length) {
      return res.json({ success: true, data: null });
    }

    const contributorSet = new Set(history.map((h) => h.authorLogin));
    res.json({
      success: true,
      data: {
        path,
        created: history[history.length - 1].date,
        lastModified: history[0].date,
        totalChanges: history.length,
        contributors: contributorSet.size,
        history,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/structure?date=YYYY-MM-DD  — Phase 12
export const getStructureAtDate = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { date } = req.query;

    const token = await getUserToken(req);
    let ref;
    if (date) {
      const commitAtDate = await github.fetchCommitAtDate(
        owner,
        repo,
        new Date(date).toISOString(),
        token
      );
      if (!commitAtDate) {
        return res.json({ success: true, data: [] });
      }
      ref = commitAtDate.sha;
    } else {
      const repository = await getOrRefreshRepository(owner, repo, token);
      ref = repository.defaultBranch || "main";
    }

    const tree = await github.fetchTreeAtRef(owner, repo, ref, token);
    // Return just top-level directory structure for readability
    const topLevel = [
      ...new Set(
        tree.map((t) => t.path.split("/")[0]).filter(Boolean)
      ),
    ];

    res.json({ success: true, data: { ref, topLevel, fullTree: tree } });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/:owner/:repo/compare?from=YYYY-MM-DD&to=YYYY-MM-DD  — Phase 13
export const compareVersions = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const { from, to } = req.query;
    if (!from || !to) {
      const e = new Error("Query params 'from' and 'to' are required");
      e.statusCode = 400;
      throw e;
    }

    const token = await getUserToken(req);
    const repository = await getOrRefreshRepository(owner, repo, token);

    const [commitFrom, commitTo] = await Promise.all([
      github.fetchCommitAtDate(owner, repo, new Date(from).toISOString(), token),
      github.fetchCommitAtDate(owner, repo, new Date(to).toISOString(), token),
    ]);

    if (!commitFrom || !commitTo) {
      const e = new Error("No commits found for one of the given dates");
      e.statusCode = 404;
      throw e;
    }

    const [treeFrom, treeTo] = await Promise.all([
      github.fetchTreeAtRef(owner, repo, commitFrom.sha, token),
      github.fetchTreeAtRef(owner, repo, commitTo.sha, token),
    ]);

    const pathsFrom = new Map(treeFrom.filter((t) => t.type === "blob").map((t) => [t.path, t.sha]));
    const pathsTo = new Map(treeTo.filter((t) => t.type === "blob").map((t) => [t.path, t.sha]));

    let added = 0,
      modified = 0,
      deleted = 0;

    for (const [path, sha] of pathsTo) {
      if (!pathsFrom.has(path)) added += 1;
      else if (pathsFrom.get(path) !== sha) modified += 1;
    }
    for (const path of pathsFrom.keys()) {
      if (!pathsTo.has(path)) deleted += 1;
    }

    const commitsInRange = await Commit.find({
      repositoryId: repository._id,
      date: { $gte: new Date(from), $lte: new Date(to) },
    });
    const contributorCounts = {};
    for (const c of commitsInRange) {
      const author = c.authorLogin || c.authorName || "unknown";
      contributorCounts[author] = (contributorCounts[author] || 0) + 1;
    }

    res.json({
      success: true,
      data: {
        from: { date: from, sha: commitFrom.sha },
        to: { date: to, sha: commitTo.sha },
        files: { added, modified, deleted },
        contributorCommits: Object.entries(contributorCounts)
          .map(([author, commits]) => ({ author, commits }))
          .sort((a, b) => b.commits - a.commits),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/meta/rate-limit — GitHub API quota remaining
export const getRateLimit = async (req, res, next) => {
  try {
    const token = await getUserToken(req);
    const data = await github.fetchRateLimit(token);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/repos/meta/my-repos — the logged-in user's own GitHub repos
// (including private ones), so they can pick one instead of pasting a URL.
export const getMyGithubRepositories = async (req, res, next) => {
  try {
    const token = await getUserToken(req);
    if (!token) {
      const e = new Error(
        "Connect your GitHub account (Settings → GitHub) to browse your repositories."
      );
      e.statusCode = 400;
      throw e;
    }
    const repos = await github.fetchUserRepositories(token);
    res.json({ success: true, data: repos });
  } catch (err) {
    next(err);
  }
};

// POST /api/repos/:owner/:repo/sync  — Phase 16 incremental sync
export const syncRepository = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const repository = await Repository.findOne({ owner, name: repo });
    if (!repository) {
      const e = new Error("Repository not analyzed yet — call /analyze first");
      e.statusCode = 404;
      throw e;
    }

    const token = await getUserToken(req);
    const since = repository.lastSyncedAt
      ? repository.lastSyncedAt.toISOString()
      : undefined;

    const newCommitCount = await upsertCommits(repository._id, owner, repo, {
      since,
      token,
    });
    await upsertRepository(owner, repo, token); // refresh stars/forks/languages too

    res.json({
      success: true,
      data: { newCommits: newCommitCount, lastSyncedAt: new Date() },
    });
  } catch (err) {
    next(err);
  }
};

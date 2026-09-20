import axios from "axios";

const GITHUB_API = "https://api.github.com";

// Builds a client using a specific access token when one is supplied
// (a logged-in user's own GitHub token — needed to see their private repos),
// falling back to the app-level GITHUB_TOKEN, and finally to unauthenticated
// access. Every exported function below takes an optional trailing `token`
// argument that flows through to here.
function client(token) {
  const resolved = token || process.env.GITHUB_TOKEN;
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      Accept: "application/vnd.github+json",
      ...(resolved && { Authorization: `Bearer ${resolved}` }),
    },
  });
}

// Wrap GitHub's error shapes into something the controllers can branch on.
function handleGithubError(error) {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      const e = new Error("Repository not found");
      e.statusCode = 404;
      throw e;
    }
    if (status === 403) {
      const e = new Error(
        "GitHub API rate limit reached. Add a GITHUB_TOKEN, or sign in with GitHub, to raise the limit."
      );
      e.statusCode = 429;
      throw e;
    }
  }
  throw error;
}

export async function fetchRepository(owner, repo, token) {
  try {
    const { data } = await client(token).get(`/repos/${owner}/${repo}`);
    return {
      githubId: data.id,
      owner: data.owner.login,
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      openIssues: data.open_issues_count,
      defaultBranch: data.default_branch,
      isPrivate: data.private,
      githubCreatedAt: data.created_at,
      githubUpdatedAt: data.updated_at,
    };
  } catch (err) {
    handleGithubError(err);
  }
}

export async function fetchLanguages(owner, repo, token) {
  try {
    const { data } = await client(token).get(`/repos/${owner}/${repo}/languages`);
    return data; // { JavaScript: 12345, CSS: 2345, ... } bytes per language
  } catch (err) {
    handleGithubError(err);
  }
}

export async function fetchContributors(owner, repo, token) {
  try {
    const { data } = await client(token).get(
      `/repos/${owner}/${repo}/contributors`,
      { params: { per_page: 100 } }
    );
    return data.map((c) => ({
      username: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
    }));
  } catch (err) {
    handleGithubError(err);
  }
}

/**
 * Fetches commits, optionally only those after a given SHA/date
 * (used for incremental sync — Phase 16).
 */
export async function fetchCommits(
  owner,
  repo,
  { since, page = 1, perPage = 100, token } = {}
) {
  try {
    const { data } = await client(token).get(`/repos/${owner}/${repo}/commits`, {
      params: {
        per_page: perPage,
        page,
        ...(since && { since }),
      },
    });
    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      authorName: c.commit.author?.name,
      authorLogin: c.author?.login,
      authorAvatar: c.author?.avatar_url,
      date: c.commit.author?.date,
    }));
  } catch (err) {
    handleGithubError(err);
  }
}

export async function fetchCommitDetail(owner, repo, sha, token) {
  try {
    const { data } = await client(token).get(
      `/repos/${owner}/${repo}/commits/${sha}`
    );
    return {
      sha: data.sha,
      message: data.commit.message,
      authorName: data.commit.author?.name,
      authorLogin: data.author?.login,
      date: data.commit.author?.date,
      additions: data.stats?.additions || 0,
      deletions: data.stats?.deletions || 0,
      filesChanged: (data.files || []).map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        patch: f.patch,
      })),
    };
  } catch (err) {
    handleGithubError(err);
  }
}

/** Repo file tree at a given ref (branch, tag, or commit SHA) — used for
 * Phase 11 (file evolution) and Phase 12 (structure evolution). */
export async function fetchTreeAtRef(owner, repo, ref, token) {
  try {
    const { data } = await client(token).get(
      `/repos/${owner}/${repo}/git/trees/${ref}`,
      { params: { recursive: 1 } }
    );
    return data.tree; // [{ path, type: 'blob'|'tree', sha, size }, ...]
  } catch (err) {
    handleGithubError(err);
  }
}

/** Commit history that touched a specific file path — used for
 * Phase 11's per-file version history. */
export async function fetchFileHistory(owner, repo, path, token) {
  try {
    const { data } = await client(token).get(`/repos/${owner}/${repo}/commits`, {
      params: { path, per_page: 100 },
    });
    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author?.date,
      authorLogin: c.author?.login,
    }));
  } catch (err) {
    handleGithubError(err);
  }
}

/** Current GitHub API rate limit status — pass a user token to check their
 * personal quota, otherwise checks the app-level GITHUB_TOKEN (or the
 * anonymous 60/hr limit if neither is set). */
export async function fetchRateLimit(token) {
  const { data } = await client(token).get(`/rate_limit`);
  return data.resources.core; // { limit, remaining, reset }
}

/** Finds the commit SHA closest to (but not after) a given date —
 * this is the core primitive behind "time travel" (Phase 10). */
export async function fetchCommitAtDate(owner, repo, isoDate, token) {
  try {
    const { data } = await client(token).get(`/repos/${owner}/${repo}/commits`, {
      params: { until: isoDate, per_page: 1 },
    });
    return data[0] || null;
  } catch (err) {
    handleGithubError(err);
  }
}

/** The authenticated user's own repositories (including private ones,
 * since the token carries the `repo` scope) — used for repository search
 * / "pick from my repos" instead of pasting a URL. */
export async function fetchUserRepositories(token) {
  const { data } = await client(token).get("/user/repos", {
    params: { per_page: 100, sort: "updated" },
  });
  return data.map((r) => ({
    owner: r.owner.login,
    name: r.name,
    fullName: r.full_name,
    isPrivate: r.private,
    stars: r.stargazers_count,
    language: r.language,
    updatedAt: r.updated_at,
  }));
}

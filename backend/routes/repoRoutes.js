import express from "express";
import {
  analyzeRepository,
  getSavedRepositories,
  removeSavedRepository,
  getRateLimit,
  getMyGithubRepositories,
  getRepository,
  getCommits,
  getCommitDetail,
  getContributors,
  getLanguages,
  getTimeline,
  getAnalytics,
  getHeatmap,
  getSnapshot,
  getFileTree,
  getFileHistory,
  getStructureAtDate,
  compareVersions,
  syncRepository,
} from "../controllers/repoController.js";
import { protect } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

// Specific/static paths first, so they aren't swallowed by the
// ":owner/:repo" wildcard routes below.
/**
 * @openapi
 * /repos/analyze:
 *   post:
 *     summary: Analyze a GitHub repository (creates/refreshes the MongoDB cache)
 *     tags: [Repositories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [repoUrl]
 *             properties: { repoUrl: { type: string, example: "https://github.com/facebook/react" } }
 *     responses:
 *       200: { description: Repository metadata }
 *       404: { description: Repository not found on GitHub }
 */
router.post("/analyze", optionalAuth, analyzeRepository);
/**
 * @openapi
 * /repos:
 *   get:
 *     summary: List the current user's saved analyses
 *     tags: [Repositories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Array of saved repository analyses }
 */
router.get("/", protect, getSavedRepositories);
router.delete("/:id([0-9a-fA-F]{24})", protect, removeSavedRepository);
router.get("/meta/rate-limit", optionalAuth, getRateLimit);
router.get("/meta/my-repos", protect, getMyGithubRepositories);

/**
 * @openapi
 * /repos/{owner}/{repo}:
 *   get:
 *     summary: Get cached repository metadata (auto-refreshes hourly)
 *     tags: [Repositories]
 *     parameters:
 *       - { in: path, name: owner, required: true, schema: { type: string } }
 *       - { in: path, name: repo, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Repository metadata + counts }
 */
router.get("/:owner/:repo", optionalAuth, getRepository);
/**
 * @openapi
 * /repos/{owner}/{repo}/commits:
 *   get:
 *     summary: List commits (paginated, optional author/date filters)
 *     tags: [Commits]
 *     parameters:
 *       - { in: path, name: owner, required: true, schema: { type: string } }
 *       - { in: path, name: repo, required: true, schema: { type: string } }
 *       - { in: query, name: author, schema: { type: string } }
 *       - { in: query, name: since, schema: { type: string, format: date } }
 *       - { in: query, name: until, schema: { type: string, format: date } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *     responses:
 *       200: { description: Paginated commit list }
 */
router.get("/:owner/:repo/commits", optionalAuth, getCommits);
router.get("/:owner/:repo/commits/:sha", optionalAuth, getCommitDetail);
router.get("/:owner/:repo/contributors", optionalAuth, getContributors);
router.get("/:owner/:repo/languages", optionalAuth, getLanguages);
router.get("/:owner/:repo/timeline", optionalAuth, getTimeline);
router.get("/:owner/:repo/analytics", optionalAuth, getAnalytics);
router.get("/:owner/:repo/heatmap", optionalAuth, getHeatmap);
/**
 * @openapi
 * /repos/{owner}/{repo}/snapshot:
 *   get:
 *     summary: "Time travel: repository state as of a given date"
 *     tags: [Time Travel]
 *     parameters:
 *       - { in: path, name: owner, required: true, schema: { type: string } }
 *       - { in: path, name: repo, required: true, schema: { type: string } }
 *       - { in: query, name: date, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200: { description: File count, contributor count, and commit count as of that date }
 */
router.get("/:owner/:repo/snapshot", optionalAuth, getSnapshot);
router.get("/:owner/:repo/files", optionalAuth, getFileTree);
router.get("/:owner/:repo/files/history", optionalAuth, getFileHistory);
router.get("/:owner/:repo/structure", optionalAuth, getStructureAtDate);
/**
 * @openapi
 * /repos/{owner}/{repo}/compare:
 *   get:
 *     summary: Compare repository state between two dates
 *     tags: [Compare]
 *     parameters:
 *       - { in: path, name: owner, required: true, schema: { type: string } }
 *       - { in: path, name: repo, required: true, schema: { type: string } }
 *       - { in: query, name: from, required: true, schema: { type: string, format: date } }
 *       - { in: query, name: to, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200: { description: Files added/modified/deleted + contributor commit counts in range }
 */
router.get("/:owner/:repo/compare", optionalAuth, compareVersions);
router.post("/:owner/:repo/sync", optionalAuth, syncRepository);

export default router;

import api from "./api";

export const analyzeRepo = (repoUrl) =>
  api.post("/repos/analyze", { repoUrl }).then((r) => r.data.data);

export const getRepo = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}`).then((r) => r.data.data);

export const getCommits = (owner, repo, params = {}) =>
  api.get(`/repos/${owner}/${repo}/commits`, { params }).then((r) => r.data);

export const getCommitDetail = (owner, repo, sha) =>
  api.get(`/repos/${owner}/${repo}/commits/${sha}`).then((r) => r.data.data);

export const getContributors = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/contributors`).then((r) => r.data.data);

export const getLanguages = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/languages`).then((r) => r.data.data);

export const getTimeline = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/timeline`).then((r) => r.data.data);

export const getAnalytics = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/analytics`).then((r) => r.data.data);

export const getHeatmap = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/heatmap`).then((r) => r.data.data);

export const getSnapshot = (owner, repo, date) =>
  api
    .get(`/repos/${owner}/${repo}/snapshot`, { params: { date } })
    .then((r) => r.data.data);

export const getFileTree = (owner, repo) =>
  api.get(`/repos/${owner}/${repo}/files`).then((r) => r.data.data);

export const getFileHistory = (owner, repo, path) =>
  api
    .get(`/repos/${owner}/${repo}/files/history`, { params: { path } })
    .then((r) => r.data.data);

export const compareVersions = (owner, repo, from, to) =>
  api
    .get(`/repos/${owner}/${repo}/compare`, { params: { from, to } })
    .then((r) => r.data.data);

export const syncRepo = (owner, repo) =>
  api.post(`/repos/${owner}/${repo}/sync`).then((r) => r.data.data);

export const getSavedRepos = () => api.get("/repos").then((r) => r.data.data);

export const removeSavedRepo = (repositoryId) =>
  api.delete(`/repos/${repositoryId}`).then((r) => r.data);

export const getRateLimit = () =>
  api.get("/repos/meta/rate-limit").then((r) => r.data.data);

export const getMyGithubRepos = () =>
  api.get("/repos/meta/my-repos").then((r) => r.data.data);

export const createShareLink = (repositoryId) =>
  api.post("/share", { repositoryId }).then((r) => r.data.data);

export const getSharedAnalysis = (shareId) =>
  api.get(`/share/${shareId}`).then((r) => r.data.data);

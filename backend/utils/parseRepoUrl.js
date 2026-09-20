/**
 * Accepts forms like:
 *   https://github.com/facebook/react
 *   https://github.com/facebook/react.git
 *   github.com/facebook/react
 *   facebook/react
 */
export function parseRepoUrl(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Repository URL is required");
  }

  const cleaned = input.trim().replace(/\.git$/, "").replace(/\/$/, "");
  const match = cleaned.match(
    /(?:github\.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/
  );

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  return { owner: match[1], repo: match[2] };
}

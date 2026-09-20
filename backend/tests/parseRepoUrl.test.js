import { parseRepoUrl } from "../utils/parseRepoUrl.js";

describe("parseRepoUrl", () => {
  test("parses a full https GitHub URL", () => {
    expect(parseRepoUrl("https://github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  test("parses a URL with a trailing .git", () => {
    expect(parseRepoUrl("https://github.com/facebook/react.git")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  test("parses a bare owner/repo string", () => {
    expect(parseRepoUrl("facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  test("throws on an invalid input", () => {
    expect(() => parseRepoUrl("not a url")).toThrow();
    expect(() => parseRepoUrl("")).toThrow();
  });
});

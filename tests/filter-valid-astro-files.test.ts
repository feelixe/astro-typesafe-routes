import { describe, expect, it } from "vitest";
import { filterValidAstroFiles } from "../src";

const mockFiles = [
  "./posts/[id].astro",
  "./info.txt",
  "./posts/component.tsx",
  "./blog/index.md",
  "./blog/posts.mdx",
  "./static.html",
];

describe("filterValidAstroFiles", () => {
  it("filters out paths that are astro routes", () => {
    const filteredFiles = filterValidAstroFiles(mockFiles);

    expect(filteredFiles).toEqual([
      "./posts/[id].astro",
      "./blog/index.md",
      "./blog/posts.mdx",
      "./static.html",
    ]);
  });
});

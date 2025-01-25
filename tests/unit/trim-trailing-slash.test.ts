import { describe, expect, it } from "vitest";
import { trimTrailingSlash } from "../../src";

describe("trimTrailingSlash", () => {
  it("removes trailing slash", () => {
    expect(trimTrailingSlash(["posts/", "posts/[id]"])).toEqual([
      "posts",
      "posts/[id]",
    ]);
  });
});

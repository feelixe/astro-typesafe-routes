import { describe, expect, it } from "bun:test";
import { trimIndex } from "../../src";

describe("trimIndex", () => {
  it("removes text index from end of string", () => {
    expect(trimIndex(["posts/index", "posts/[id]"])).toEqual([
      "posts/",
      "posts/[id]",
    ]);
  });
});

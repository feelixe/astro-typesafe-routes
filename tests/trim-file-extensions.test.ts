import { describe, expect, it } from "vitest";
import { trimFileExtensions } from "../src";

describe("trimFileExtensions", () => {
  it("removes file extensions", () => {
    expect(trimFileExtensions(["index.astro", "file.route.astro"])).toEqual([
      "index",
      "file.route",
    ]);
  });
});

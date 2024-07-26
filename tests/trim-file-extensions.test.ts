import { describe, expect, it } from "vitest";
import { trimFileExtensions } from "../src/index";

describe("trimFileExtensions", () => {
  it("removes file extensions", () => {
    expect(trimFileExtensions([
      "index.astro",
      "file.route.astro",
    ])).toEqual([
      "index",
      "file.route"
    ]);
  });
});

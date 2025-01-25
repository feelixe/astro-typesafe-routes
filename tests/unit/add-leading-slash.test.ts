import { describe, it, expect } from "bun:test";
import { addLeadingSlash } from "../../src";

describe("addLeadingSlash", () => {
  it("should add a leading slash to paths without one", () => {
    expect(addLeadingSlash(["path", "another/path", "example"])).toEqual([
      "/path",
      "/another/path",
      "/example",
    ]);
  });

  it("should not add a leading slash to paths that already have one", () => {
    expect(addLeadingSlash(["/path", "/another/path", "/example"])).toEqual([
      "/path",
      "/another/path",
      "/example",
    ]);
  });

  it("should handle an empty array", () => {
    expect(addLeadingSlash([])).toEqual([]);
  });

  it("should handle mixed cases correctly", () => {
    expect(
      addLeadingSlash(["path", "/alreadyHasSlash", "anotherPath"]),
    ).toEqual(["/path", "/alreadyHasSlash", "/anotherPath"]);
  });
});

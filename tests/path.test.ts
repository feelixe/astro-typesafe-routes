import { it } from "vitest";
import { describe } from "vitest";
import { $path } from "../src/path";
import { expect } from "vitest";

describe("$path", () => {
  it("returns pathname", () => {
    expect($path("/test")).toBe("/test");
  });

  it("replaces dynamic paths with params", () => {
    expect($path("/test/[id]", { params: { id: "123" } })).toBe("/test/123");
  });

  it("replaces multiple dynamic paths with params", () => {
    expect(
      $path("/test/[lang]/[id]", { params: { id: "123", lang: "sv" } }),
    ).toBe("/test/sv/123");
  });

  it("adds search params", () => {
    expect($path("/test", { search: { key: "value" } })).toBe(
      "/test?key=value",
    );
  });

  it("does not add search params if size is zero", () => {
    expect($path("/test", { search: {} })).toBe("/test");
  });

  it("adds hash", () => {
    expect($path("/test", { hash: "hash" })).toBe("/test#hash");
  });

  it("adds hash and search param in correct order", () => {
    expect($path("/test", { hash: "hash", search: { key: "value" } })).toBe(
      "/test?key=value#hash",
    );
  });

  it("adds a trailing slash", () => {
    expect($path("/test", { trailingSlash: true })).toBe("/test/");
  });

  it("handles all options at once correctly", () => {
    expect(
      $path("/test", {
        trailingSlash: true,
        search: { key: "value" },
        hash: "hash",
      }),
    ).toBe("/test/?key=value#hash");
  });
});

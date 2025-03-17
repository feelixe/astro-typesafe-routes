import { it, describe, expect } from "bun:test";
import { $path } from "../src/path";

describe("$path", () => {
  it("returns pathname", () => {
    expect($path({ to: "/test" })).toBe("/test");
  });

  it("replaces dynamic paths with params", () => {
    expect($path({ to: "/test/[id]", params: { id: "123" } })).toBe(
      "/test/123",
    );
  });

  it("replaces multiple dynamic paths with params", () => {
    expect(
      $path({ to: "/test/[lang]/[id]", params: { id: "123", lang: "sv" } }),
    ).toBe("/test/sv/123");
  });

  it("adds search params", () => {
    expect($path({ to: "/test", searchParams: { key: "value" } })).toBe(
      "/test?key=value",
    );
  });

  it("does not add search params if size is zero", () => {
    expect($path({ to: "/test", searchParams: {} })).toBe("/test");
  });

  it("adds hash", () => {
    expect($path({ to: "/test", hash: "hash" })).toBe("/test#hash");
  });

  it("adds hash and search param in correct order", () => {
    expect(
      $path({ to: "/test", hash: "hash", searchParams: { key: "value" } }),
    ).toBe("/test?key=value#hash");
  });

  it("adds a trailing slash", () => {
    expect($path({ to: "/test", trailingSlash: true })).toBe("/test/");
  });

  it("handles all options at once correctly", () => {
    expect(
      $path({
        to: "/test",
        trailingSlash: true,
        searchParams: { key: "value" },
        hash: "hash",
      }),
    ).toBe("/test/?key=value#hash");
  });

  it("coerces numbers to string", () => {
    expect(
      $path({
        to: "/test/[id]",
        params: {
          id: 1,
        },
      }),
    ).toBe("/test/1");
  });

  it("adds typed json search", () => {
    const search = {
      age: JSON.stringify(10),
      person: JSON.stringify({ name: "John" }),
    };
    const url = $path({
      to: "/test",
      search,
    });

    const searchParams = new URLSearchParams(search);
    const expectedUrl = `/test?${searchParams.toString()}`;
    expect(url).toBe(expectedUrl);
  });
});

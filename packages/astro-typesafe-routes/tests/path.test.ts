import { it, describe, expect, beforeEach } from "bun:test";
import { $path } from "../src/path.js";

import.meta.env.BASE_URL = "/";

describe("$path", () => {
  beforeEach(() => {
    import.meta.env.BASE_URL = "/";
    import.meta.env.TRAILING_SLASH = "ignore";
  });

  it("returns pathname", () => {
    expect($path({ to: "/test" })).toBe("/test");
  });

  it("adds base url", () => {
    import.meta.env.BASE_URL = "/base";
    expect($path({ to: "/test" })).toBe("/base/test");
  });

  it("adds base url with trailing slash", () => {
    import.meta.env.BASE_URL = "/base/";
    expect($path({ to: "/test" })).toBe("/base/test");
  });

  it("replaces dynamic paths with params", () => {
    expect($path({ to: "/test/[id]", params: { id: "123" } })).toBe("/test/123");
  });

  it("replaces multiple dynamic paths with params", () => {
    expect($path({ to: "/test/[lang]/[id]", params: { id: "123", lang: "sv" } })).toBe(
      "/test/sv/123",
    );
  });

  it("handles spread params correctly", () => {
    expect(
      $path({
        to: "/test/[...rest]",
        params: { rest: "a/b/c" },
      }),
    ).toBe("/test/a/b/c");
  });

  it("adds search params", () => {
    expect($path({ to: "/test", searchParams: { key: "value" } })).toBe("/test?key=value");
  });

  it("does not add search params if size is zero", () => {
    expect($path({ to: "/test", searchParams: {} })).toBe("/test");
  });

  it("adds hash", () => {
    expect($path({ to: "/test", hash: "hash" })).toBe("/test#hash");
  });

  it("adds hash and search param in correct order", () => {
    expect($path({ to: "/test", hash: "hash", searchParams: { key: "value" } })).toBe(
      "/test?key=value#hash",
    );
  });

  it("does not add trailing slash if not configured", () => {
    import.meta.env.TRAILING_SLASH = "ignore";
    expect($path({ to: "/test" })).toBe("/test");
  });

  it("adds trailing slash if configured", () => {
    import.meta.env.TRAILING_SLASH = "always";
    expect($path({ to: "/test" })).toBe("/test/");
  });

  it("adds a trailing slash if explicitly requested", () => {
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
      age: 10,
      person: {
        name: "John",
      },
      job: "developer",
    };

    const url = $path({
      to: "/test",
      search,
    });

    const searchParams = new URLSearchParams({
      age: JSON.stringify(search.age),
      person: JSON.stringify(search.person),
      job: "developer",
    });
    const expectedUrl = `/test?${searchParams.toString()}`;

    expect(url).toBe(expectedUrl);
  });
});

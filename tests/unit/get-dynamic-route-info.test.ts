import { describe, it, expect } from "bun:test";
import { getDynamicRouteInfo, DynamicRoute } from "../../src";

describe("getDynamicRouteInfo", () => {
  it("returns correct dynamic route info for paths with single parameters", () => {
    const paths = [
      "/user/[id]",
      "/post/[category]/[id]",
      "/product/[id]/[action]",
    ];
    const expected: DynamicRoute[] = [
      { path: "/user/[id]", params: ["id"] },
      { path: "/post/[category]/[id]", params: ["category", "id"] },
      { path: "/product/[id]/[action]", params: ["id", "action"] },
    ];
    expect(getDynamicRouteInfo(paths)).toEqual(expected);
  });

  it("returns correct dynamic route info for paths with multiple parameters in the same segment", () => {
    const paths = ["/posts/[lang]-[id]"];
    const expected: DynamicRoute[] = [
      { path: "/posts/[lang]-[id]", params: ["lang", "id"] },
    ];
    expect(getDynamicRouteInfo(paths)).toEqual(expected);
  });

  it("returns params as null for paths without parameters", () => {
    const paths = ["/home", "/about", "/contact"];
    const expected: DynamicRoute[] = [
      { path: "/home", params: null },
      { path: "/about", params: null },
      { path: "/contact", params: null },
    ];
    expect(getDynamicRouteInfo(paths)).toEqual(expected);
  });

  it("handles mixed cases correctly", () => {
    const paths = [
      "/user/[id]",
      "/home",
      "/post/[category]/[id]",
      "/contact",
      "/posts/[lang]-[id]",
    ];
    const expected: DynamicRoute[] = [
      { path: "/user/[id]", params: ["id"] },
      { path: "/home", params: null },
      { path: "/post/[category]/[id]", params: ["category", "id"] },
      { path: "/contact", params: null },
      { path: "/posts/[lang]-[id]", params: ["lang", "id"] },
    ];
    expect(getDynamicRouteInfo(paths)).toEqual(expected);
  });
});

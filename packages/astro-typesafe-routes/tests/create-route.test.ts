import { beforeEach, describe, expect, it, jest } from "bun:test";
import { createRoute } from "../src/create-route.js";
import * as v from "valibot";
import { createMockAstro } from "./helpers/create-mock-astro.js";
import type { GetStaticPathsOptions } from "astro";

describe("createRoute", () => {
  beforeEach(() => {
    import.meta.env.BASE_URL = "/";
    import.meta.env.TRAILING_SLASH = "ignore";
  });

  it("returns an object with all expected methods", () => {
    const route = createRoute({
      routeId: "/",
    });

    expect(route.createGetStaticPaths).toBeTypeOf("function");
    expect(route.getParams).toBeTypeOf("function");
    expect(route.getProps).toBeTypeOf("function");
    expect(route.getSearch).toBeTypeOf("function");
    expect(route.redirect).toBeTypeOf("function");
    expect(route.rewrite).toBeTypeOf("function");
  });

  it("returns the provided search schema in the object", () => {
    const schema = v.object({ name: v.string() });
    const route = createRoute({
      routeId: "/",
      searchSchema: schema,
    });

    expect(route.searchSchema).toBe(schema);
  });

  describe("createGetStaticPaths", () => {
    it("returns a function", () => {
      const route = createRoute({ routeId: "/" });
      const returnedValue = route.createGetStaticPaths(() => []);
      expect(returnedValue).toBeTypeOf("function");
    });

    it("returns a function that returns the provided value", () => {
      const route = createRoute({ routeId: "/" });
      const returnedValue = route.createGetStaticPaths(() => [{ params: { id: "1" } }]);
      const result = returnedValue({} as GetStaticPathsOptions);
      expect(result).toEqual([{ params: { id: "1" } }]);
    });

    it("can handle an async function", async () => {
      const route = createRoute({ routeId: "/" });
      const returnedValue = route.createGetStaticPaths(async () => [{ params: { id: "1" } }]);
      const result = await returnedValue({} as GetStaticPathsOptions);
      expect(result).toEqual([{ params: { id: "1" } }]);
    });
  });

  describe("getParams", () => {
    it("returns Astro.params", () => {
      const route = createRoute({ routeId: "/" });
      const Astro = createMockAstro({
        params: {
          name: "astro",
        },
      });
      const params = route.getParams(Astro);
      expect(params).toEqual(Astro.params);
    });
  });

  describe("getProps", () => {
    it("returns Astro.props", () => {
      const route = createRoute({ routeId: "/" });
      const Astro = createMockAstro({
        props: {
          name: "astro",
        },
      });
      const params = route.getProps(Astro);
      expect(params).toEqual(Astro.props);
    });
  });

  describe("getSearch", () => {
    it("returns parsed and deserialized search params", () => {
      const route = createRoute({ routeId: "/", searchSchema: v.object({ name: v.string() }) });
      const Astro = createMockAstro({
        url: new URL("http://example.com?name=astro"),
      });
      const search = route.getSearch(Astro);
      expect(search).toEqual({ name: "astro" });
    });

    it("returns undefined if route has no search schema", () => {
      const route = createRoute({ routeId: "/" });
      const Astro = createMockAstro({
        url: new URL("http://example.com?name=astro"),
      });
      const search = route.getSearch(Astro);
      expect(search).toBeUndefined();
    });

    it("throws if paring search params fails", () => {
      const route = createRoute({ routeId: "/", searchSchema: v.object({ name: v.string() }) });
      const Astro = createMockAstro({
        url: new URL("http://example.com"),
      });
      expect(() => route.getSearch(Astro)).toThrow();
    });
  });

  describe("redirect", () => {
    it("calls Astro.redirect with correct path", () => {
      const route = createRoute({ routeId: "/" });
      const Astro = createMockAstro({
        redirect: jest.fn(),
      });
      route.redirect(Astro, { to: "/about" });
      expect(Astro.redirect).toHaveBeenCalledWith("/about");
    });
  });

  describe("rewrite", () => {
    it("calls Astro.write with correct path", () => {
      const route = createRoute({ routeId: "/" });
      const Astro = createMockAstro({
        rewrite: jest.fn(),
      });
      route.rewrite(Astro, { to: "/about" });
      expect(Astro.rewrite).toHaveBeenCalledWith("/about");
    });
  });
});

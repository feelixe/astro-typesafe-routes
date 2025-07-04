import { describe, expect, it } from "bun:test";
import astroTypesafeRoutes from "../src/index.js";
import packageJson from "../package.json" with { type: "json" };

describe("astro-typesafe-routes integration", () => {
  it("default export a function", () => {
    expect(astroTypesafeRoutes).toBeTypeOf("function");
  });

  it("returns an object with expected properties", () => {
    const integration = astroTypesafeRoutes();

    expect(integration).toBeTypeOf("object");
    expect(integration.name).toBeTypeOf("string");
    expect(integration.hooks).toBeTypeOf("object");
  });

  it("has name set to package name", () => {
    const integration = astroTypesafeRoutes();
    expect(integration.name).toBe(packageJson.name);
  });
});

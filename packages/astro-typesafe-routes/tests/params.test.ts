import { it, describe, expect } from "bun:test";
import type { AstroGlobal } from "astro";
import { getParams } from "../src/params.ts";

describe("getParams", () => {
  it("returns params", () => {
    const Astro = {
      params: {
        id: "1",
      },
    } as unknown as AstroGlobal;
    const params = getParams(Astro, "");

    expect(params).toEqual({ id: "1" });
  });
});

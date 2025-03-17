import { it, describe, expect, afterEach, jest } from "bun:test";
import { z } from "astro/zod";
import { getSearch } from "../src/search.ts";
import type { AstroGlobal } from "astro";
import * as v from "valibot";

describe("getSearch", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns parsed search with zod schema", () => {
    const Astro = {
      url: {
        searchParams: new URLSearchParams({
          age: "10",
          name: "John",
        }),
      },
    } as AstroGlobal;

    const schema = z.object({
      age: z.coerce.number(),
      name: z.string(),
    });

    const res = getSearch(Astro, schema);

    expect(res).toEqual({
      age: 10,
      name: "John",
    });
  });

  it("returns parsed search with valibot schema", () => {
    const Astro = {
      url: {
        searchParams: new URLSearchParams({
          age: "10",
          name: "John",
        }),
      },
    } as AstroGlobal;

    const schema = v.object({
      age: v.pipe(
        v.string(),
        v.transform((input) => Number(input)),
      ),
      name: v.string(),
    });

    const res = getSearch(Astro, schema);

    expect(res).toEqual({
      age: 10,
      name: "John",
    });
  });

  it("it throws error if passed search that doesn't match schema", () => {
    const Astro = {
      url: {
        searchParams: new URLSearchParams({}),
      },
    } as AstroGlobal;

    const schema = z.object({
      age: z.number(),
    });

    expect(() => getSearch(Astro, schema)).toThrow();
  });
});

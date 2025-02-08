import { it, describe, expect, spyOn, afterEach, jest } from "bun:test";
import { z } from "astro/zod";
import { getSearch } from "../../src/search.ts";
import { AstroGlobal } from "astro";

const schema = z.object({
  age: z.number(),
  person: z.object({
    name: z.string(),
  }),
});

describe("getSearch", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns parsed search", () => {
    const Astro = {
      url: {
        searchParams: new URLSearchParams({
          age: JSON.stringify(10),
          person: JSON.stringify({ name: "John" }),
        }),
      },
    } as AstroGlobal;

    const spy = spyOn(schema, "parse");
    const res = getSearch(Astro, schema);

    expect(spy).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      age: 10,
      person: {
        name: "John",
      },
    });
  });

  it("it throws error if passed search that doesn't match schema", () => {
    const Astro = {
      url: {
        searchParams: new URLSearchParams({}),
      },
    } as AstroGlobal;

    expect(() => getSearch(Astro, schema)).toThrow();
  });
});

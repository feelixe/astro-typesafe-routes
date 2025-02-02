import { AstroGlobal } from "astro";
import { z } from "astro/zod";
import { deserialize } from "./search-serializer.js";

export function getSearch(astro: AstroGlobal, schema: z.ZodTypeAny) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  return schema.parse(deserializedSearch);
}

export function getSearchSafe(astro: AstroGlobal, schema: z.ZodTypeAny) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  return schema.safeParse(deserializedSearch);
}

export function getSearchSafeAsync(astro: AstroGlobal, schema: z.ZodTypeAny) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  return schema.safeParseAsync(deserializedSearch);
}

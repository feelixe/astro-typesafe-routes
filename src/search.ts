import { AstroGlobal } from "astro";
import { z } from "astro/zod";
import { deserialize } from "./search-serializer.js";

export function getSearch<T extends z.ZodTypeAny>(
  astro: AstroGlobal,
  schema: T,
) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  return schema.parse(deserializedSearch) as z.infer<T>;
}

export async function getSearchAsync<T extends z.ZodTypeAny>(
  astro: AstroGlobal,
  schema: T,
) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  const parsedValue = await schema.parseAsync(deserializedSearch);
  return parsedValue as z.infer<T>;
}

export function getSearchSafe<T extends z.ZodTypeAny>(
  astro: AstroGlobal,
  schema: T,
) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  return schema.safeParse(deserializedSearch) as z.SafeParseReturnType<
    z.input<T>,
    z.output<T>
  >;
}

export async function getSearchSafeAsync<T extends z.ZodTypeAny>(
  astro: AstroGlobal,
  schema: T,
) {
  const deserializedSearch = deserialize(astro.url.searchParams);
  const validation = await schema.safeParseAsync(deserializedSearch);
  return validation as z.SafeParseReturnType<z.input<T>, z.output<T>>;
}

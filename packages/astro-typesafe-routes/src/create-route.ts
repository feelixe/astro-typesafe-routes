import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteParams = {
  id: string;
  Astro: AstroGlobal;
  searchSchema?: StandardSchemaV1;
};

export function createRoute(args: CreateRouteParams) {
  return {
    params: args.Astro.params,
    search: args.searchSchema ? getSearch(args.Astro, args.searchSchema) : undefined,
  };
}

export const hej = 123;

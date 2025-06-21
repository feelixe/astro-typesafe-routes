import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteParams = {
  id: string;
  searchSchema?: StandardSchemaV1;
};

export function createRoute(astro: AstroGlobal, args: CreateRouteParams) {
  return {
    params: astro.params,
    search: args.searchSchema ? getSearch(astro, args.searchSchema) : undefined,
  };
}

export const hej = 123;

import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteOpts = {
  Astro: AstroGlobal;
  searchSchema?: StandardSchemaV1;
};

export function createRoute(_routeId: string, opts: CreateRouteOpts) {
  return {
    params: opts.Astro.params,
    search: opts?.searchSchema ? getSearch(opts.Astro, opts.searchSchema) : undefined,
  };
}

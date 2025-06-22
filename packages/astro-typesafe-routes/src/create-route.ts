import { type RouteOptions, $path } from "./path.js";
import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteOptions = {
  Astro: AstroGlobal;
  searchSchema?: StandardSchemaV1;
};

export function createRoute(_routeId: string, opts: CreateRouteOptions) {
  return {
    params: opts.Astro.params,
    search: opts?.searchSchema ? getSearch(opts.Astro, opts.searchSchema) : undefined,
    redirect: (args: RouteOptions) => {
      return opts.Astro.redirect($path(args));
    },
    rewrite: (args: RouteOptions) => {
      return opts.Astro.rewrite($path(args));
    },
  };
}

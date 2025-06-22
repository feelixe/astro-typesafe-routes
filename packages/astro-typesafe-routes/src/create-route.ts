import { type RouteOptions, $path } from "./path.js";
import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteOptions = {
  routeId: string;

  searchSchema?: StandardSchemaV1;
};

export function createRoute(Astro: AstroGlobal, opts: CreateRouteOptions) {
  return {
    params: Astro.params,
    search: opts?.searchSchema ? getSearch(Astro, opts.searchSchema) : undefined,
    redirect: (args: RouteOptions) => {
      return Astro.redirect($path(args));
    },
    rewrite: (args: RouteOptions) => {
      return Astro.rewrite($path(args));
    },
  };
}

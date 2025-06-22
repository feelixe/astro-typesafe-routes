import { type RouteOptions, $path } from "./path.js";
import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal } from "astro";

export type CreateRouteSchemaParams = {
  routeId: string;
  searchSchema?: StandardSchemaV1;
};

export function createRouteSchema(opts: CreateRouteSchemaParams) {
  return {
    searchSchema: opts.searchSchema,
    parse: (astro: AstroGlobal) => {
      return {
        params: astro.params,
        search: opts?.searchSchema ? getSearch(astro, opts.searchSchema) : undefined,
        redirect: (args: RouteOptions) => {
          return astro.redirect($path(args));
        },
        rewrite: (args: RouteOptions) => {
          return astro.rewrite($path(args));
        },
      };
    },
  };
}

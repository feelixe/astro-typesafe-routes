import { type RouteOptions, $path } from "./path.js";
import { getSearch } from "./search.js";
import type { StandardSchemaV1 } from "./standard-schema.js";
import type { AstroGlobal, GetStaticPaths } from "astro";

type AstroAny = AstroGlobal<any, any, any>;

export type CreateRouteParams = {
  routeId: string;
  searchSchema?: StandardSchemaV1;
};

export function createRoute(opts: CreateRouteParams) {
  return {
    searchSchema: opts.searchSchema,
    getParams: (astro: AstroAny) => {
      return astro.params;
    },
    getSearch: (astro: AstroAny) => {
      return opts?.searchSchema ? getSearch(astro, opts.searchSchema) : undefined;
    },
    getProps: (astro: AstroAny) => {
      return astro.props;
    },
    redirect: (astro: AstroAny, link: RouteOptions) => {
      return astro.redirect($path(link));
    },
    rewrite: (astro: AstroAny, link: RouteOptions) => {
      return astro.rewrite($path(link));
    },
    createGetStaticPaths: (fn: GetStaticPaths) => {
      return fn;
    },
  };
}

import type { IntegrationResolvedRoute } from "astro";
import type { RequiredAstroConfig, ResolvedRoute } from "./types.js";
import * as path from "node:path";
import { doesRouteHaveSearchSchema } from "./search-params.js";
import { segmentsToPath } from "./segment.js";

export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
  astroConfig: RequiredAstroConfig;
};

export async function getRoutes(args: GetRoutesParams): Promise<ResolvedRoute[]> {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal" && route.type !== "redirect",
  );
  const promises = withoutInternal.map(async (route) => {
    const absolutePath = path.join(args.astroConfig.rootDir, route.entrypoint);

    // Search params have no effect on static builds.
    const shouldCheckForSearchSchemas = args.astroConfig.buildOutput === "server";
    const hasSearchSchema = shouldCheckForSearchSchemas
      ? await doesRouteHaveSearchSchema(absolutePath)
      : false;

    const params = route.segments
      .flatMap((segment) =>
        // Only include dynamic segments (params)
        segment.filter((routePart) => routePart.dynamic),
      )
      .map((routePart) =>
        // Remove the ellipsis if it's a spread param
        routePart.spread ? routePart.content.slice(3) : routePart.content,
      );

    const routePath = segmentsToPath(route.segments);

    return {
      path: routePath,
      params: params.length > 0 ? params : null,
      absolutePath,
      hasSearchSchema,
    };
  });

  return await Promise.all(promises);
}

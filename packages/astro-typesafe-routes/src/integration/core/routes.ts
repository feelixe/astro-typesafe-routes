import type { AstroConfig, IntegrationResolvedRoute } from "astro";
import type { ResolvedRoute } from "./types.js";
import * as path from "node:path";
import { doesRouteHaveSearchSchema } from "./search-params.js";
import { segmentsToPath } from "./segment.js";
import { fileURLToPath } from "node:url";

export type GetRoutesParams = {
  resolvedRoutes: IntegrationResolvedRoute[];
  astroConfig: AstroConfig;
};

export async function getRoutes(args: GetRoutesParams): Promise<ResolvedRoute[]> {
  const withoutInternal = args.resolvedRoutes.filter(
    (route) => route.origin !== "internal" && route.type !== "redirect",
  );
  const promises = withoutInternal.map(async (route) => {
    const rootDir = fileURLToPath(args.astroConfig.root);
    const absolutePath = path.join(rootDir, route.entrypoint);

    // Search params have no effect on static builds.
    const shouldCheckForSearchSchemas = args.astroConfig.output === "server";

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

/**
 * For compatibility with Astro 4 which doesn't have the
 * integration hook astro:routes:resolved
 */

import * as path from "path";
// import { DynamicRoute } from "../common/types.js";
import fastGlob from "fast-glob";
import { doesRouteHaveSearchSchema } from "../common/search-params.js";
import { ResolvedRoute, RouteFile, RouteFileWithSearch } from "../common/types";

const PAGES_PATTERN = "src/pages/**/*.{astro,md,mdx,html}";

async function listAstroRouteFiles(rootDir: string): Promise<RouteFile[]> {
  const routePaths = await fastGlob(PAGES_PATTERN, {
    cwd: rootDir,
    absolute: true,
  });
  return routePaths.map((routePath) => ({ absolutePath: routePath }));
}

async function getRouteSearch(
  routes: RouteFile[]
): Promise<RouteFileWithSearch[]> {
  const promises = routes.map(async (route) => {
    return {
      absolutePath: route.absolutePath,
      hasSearchSchema: await doesRouteHaveSearchSchema(route.absolutePath),
    };
  });

  return await Promise.all(promises);
}

function normalizeSeparators(value: string) {
  return value.replaceAll(path.win32.sep, path.posix.sep);
}

function trimFileExtensions(value: string) {
  return value.replace(/\.([^.]+)$/, "");
}

function trimIndex(value: string) {
  return value.replace(/index$/, "");
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function addLeadingSlash(value: string) {
  return value.startsWith("/") ? value : "/" + value;
}

function getRouteParams(value: string) {
  return (value.match(/(\[[^\]]+\])/g) || []).map((segment) =>
    segment.replace(/\[|\]/g, "")
  );
}

type getResolvedRoutesParams = {
  routesWithSearch: RouteFileWithSearch[];
  rootDir: string;
};

async function getResolvedRoutes(
  args: getResolvedRoutesParams
): Promise<ResolvedRoute[]> {
  const promises = args.routesWithSearch.map(async (route) => {
    const pagesDir = path.join(args.rootDir, "src", "pages");
    const relativePath = path.relative(pagesDir, route.absolutePath);
    const withNormalizedSeparators = normalizeSeparators(relativePath);
    const withoutExtension = trimFileExtensions(withNormalizedSeparators);
    const withoutIndex = trimIndex(withoutExtension);
    const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
    const withLeadingSlash = addLeadingSlash(withoutTrailingSlash);
    const params = getRouteParams(withLeadingSlash);

    return {
      absolutePath: route.absolutePath,
      hasSearchSchema: route.hasSearchSchema,
      path: withLeadingSlash,
      params: params.length === 0 ? null : params,
    };
  });

  return await Promise.all(promises);
}

export async function resolveRoutesAstroV4(
  rootDir: string
): Promise<ResolvedRoute[]> {
  const routes = await listAstroRouteFiles(rootDir);
  const routesWithSearch = await getRouteSearch(routes);
  return await getResolvedRoutes({
    routesWithSearch,
    rootDir,
  });
}

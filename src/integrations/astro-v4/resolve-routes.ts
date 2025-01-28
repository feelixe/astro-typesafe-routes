/**
 * For compatibility with Astro 4 which doesn't have the
 * integration hook astro:routes:resolved
 */

import * as path from "path";
import { DynamicRoute } from "../../types.js";
import fastGlob from "fast-glob";

const PAGES_PATTERN = "src/pages/**/*.{astro,md,mdx,html}";

async function listAstroRouteFiles(rootDir: string) {
  const files = await fastGlob(PAGES_PATTERN, { cwd: rootDir });
  const pagesDir = path.join(rootDir, "src", "pages");
  return files.map((el) => path.relative(pagesDir, el));
}

function normalizeSeparators(paths: string[]) {
  return paths.map((routePath) => routePath.replaceAll(path.sep, "/"));
}

function trimFileExtensions(paths: string[]) {
  return paths.map((path) => path.replace(/\.([^.]+)$/, ""));
}

function trimIndex(paths: string[]) {
  return paths.map((path) => path.replace(/index$/, ""));
}

function trimTrailingSlash(paths: string[]) {
  return paths.map((path) => path.replace(/\/$/, ""));
}

function addLeadingSlash(paths: string[]) {
  return paths.map((path) => (path.startsWith("/") ? path : "/" + path));
}

function getDynamicRouteInfo(paths: string[]): DynamicRoute[] {
  return paths.map((path) => {
    const paramSegments = (path.match(/(\[[^\]]+\])/g) || []).map((segment) =>
      segment.replace(/\[|\]/g, ""),
    );
    return {
      path,
      params: paramSegments.length === 0 ? null : paramSegments,
    };
  });
}

export async function resolveRoutes(pagesDir: string) {
  const routeFiles = await listAstroRouteFiles(pagesDir);
  const withNormalizedSeparators = normalizeSeparators(routeFiles);
  const withoutExtension = trimFileExtensions(withNormalizedSeparators);
  const withoutIndex = trimIndex(withoutExtension);
  const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
  const withLeading = addLeadingSlash(withoutTrailingSlash);
  return getDynamicRouteInfo(withLeading);
}

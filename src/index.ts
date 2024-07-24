import * as fs from "node:fs/promises";
import * as path from "path";
import * as prettier from "prettier";

export async function listFiles(dir: string) {
  let results: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subdirFiles = await listFiles(fullPath);
      results = results.concat(
        subdirFiles.map((file) => path.join(entry.name, file))
      );
    } else {
      results.push(entry.name);
    }
  }

  return results;
}

export function filterValidAstroFiles(paths: string[]) {
  return paths.filter((p) => p.match(/\.(astro|md)$/));
}

export function trimRouteFileExtension(paths: string[]) {
  return paths.map((path) => path.replace(/\.(astro|md)$/, ""));
}

export function trimIndex(paths: string[]) {
  return paths.map((path) => path.replace(/index$/, ""));
}

export function trimTrailingSlash(paths: string[]) {
  return paths.map((path) => path.replace(/\/$/, ""));
}

export function addLeadingSlash(paths: string[]) {
  return paths.map((path) => (path.startsWith("/") ? path : "/" + path));
}

export type DynamicRoute = { path: string; params: string[] | null };

export function getDynamicRouteInfo(paths: string[]): DynamicRoute[] {
  return paths.map((path) => {
    const paramSegments = (path.match(/(\[[^\]]+\])/g) || []).map((segment) =>
      segment.replace(/[\[\]]/g, "")
    );
    return {
      path,
      params: paramSegments.length === 0 ? null : paramSegments,
    };
  });
}

export async function getRouteFileContent(routes: DynamicRoute[], trailingSlash: boolean) {
  const routeEntries = routes.map((route) => [
    route.path,
    { params: route.params },
  ]);
  const routesObject = Object.fromEntries(routeEntries);

  let template = await fs.readFile(
    path.join(import.meta.dirname, "./template.ts"),
    { encoding: "utf-8" }
  );

  template = template.replace(
    "export type Routes = {}",
    `export type Routes = ${JSON.stringify(routesObject)}`
  );

  if(trailingSlash) {
    template = template.replace(
      "const defaultTrailingSlash = false;",
      "const defaultTrailingSlash = true;"
    );
  
  }

  return template
}

export async function writeRouteFile(path: string, content: string) {
  await fs.writeFile(path, content, { encoding: "utf-8" });
}

export async function formatPrettier(content: string) {
  return await prettier.format(content, { parser: "typescript" });
}

export function logSuccess(path: string) {
  console.log(`✅ TypeSafe Astro route successfully created at ${path}`);
}

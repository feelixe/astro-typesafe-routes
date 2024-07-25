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
      segment.replace(/\[|\]/g, '')
    );
    return {
      path,
      params: paramSegments.length === 0 ? null : paramSegments,
    };
  });
}

export type GetRouteFileContentOpts = {
  trailingSlash: boolean;
  functionName: string;
}

export async function getRouteFileContent(routes: DynamicRoute[], opts: GetRouteFileContentOpts) {
  const routeEntries = routes.map((route) => [
    route.path,
    { params: route.params },
  ]);
  const routesObject = Object.fromEntries(routeEntries);

  return `
    export type Routes = ${JSON.stringify(routesObject)};

    const defaultTrailingSlash = ${opts.trailingSlash};

    type Route = keyof Routes;

    type ParamsRecord<T extends Route> =
      Routes[T]["params"] extends Array<string>
        ? { [key in Routes[T]["params"][number]]: string }
        : null;

    type PathParameters<T extends Route> = (Routes[T]["params"] extends null
      ? void
      : { params: ParamsRecord<T> }) & {
      search?: string | URLSearchParams;
      hash?: string;
      trailingSlash?: boolean;
      path: T;
    };

    export function ${opts.functionName}<T extends Route>(args: PathParameters<T>) {
      const trailingSlash = args.trailingSlash ?? defaultTrailingSlash;

      let url: string = args.path;

      if(trailingSlash) {
        url += "/";
      }

      if ("params" in args && args.params !== null) {
        for (const [paramKey, paramValue] of Object.entries<string>(args.params)) {
          url = url.replace(\`[\${paramKey}]\`, paramValue);
        }
      }

      if (args.search !== undefined) {
        const search =
          typeof args.search === "string"
            ? new URLSearchParams(args.search)
            : args.search;
        url += \`?\${search.toString()}\`;
      }

      if (args.hash !== undefined) {
        url += \`#\${args.hash}\`;
      }

      return url;
    }`
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

export function isValidFunctionName(name: string) {
  const functionNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return functionNameRegex.test(name);
}

export async function getRoutes(pagesPath: string) {
  const files = await listFiles(pagesPath);
  const astroFiles = filterValidAstroFiles(files);
  const withoutExtension = trimRouteFileExtension(astroFiles);
  const withoutIndex = trimIndex(withoutExtension);
  const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
  const withLeading = addLeadingSlash(withoutTrailingSlash);
  return getDynamicRouteInfo(withLeading);
}
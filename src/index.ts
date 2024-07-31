import * as fs from "node:fs/promises";
import * as path from "path";
import * as prettier from "prettier";
import chokidar from "chokidar";

export async function listFiles(dir: string) {
  let results: string[] = [];

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subdirFiles = await listFiles(fullPath);
      results = results.concat(
        subdirFiles.map((file) => path.join(entry.name, file)),
      );
    } else {
      results.push(entry.name);
    }
  }

  return results;
}

export function filterValidAstroFiles(paths: string[]) {
  return paths.filter((p) => p.match(/\.(astro|md|mdx|html)$/));
}

export function trimFileExtensions(paths: string[]) {
  return paths.map((path) => path.replace(/\.([^.]+)$/, ""));
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
      segment.replace(/\[|\]/g, ""),
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
};

export async function getRouteFileContent(
  routes: DynamicRoute[],
  opts: GetRouteFileContentOpts,
) {
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
      ? { path: T }
      : { params: ParamsRecord<T>; path: T }) & {
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
    }`;
}

export async function writeRouteFile(path: string, content: string) {
  await fs.writeFile(path, content, { encoding: "utf-8" });
}

export async function formatPrettier(content: string) {
  return await prettier.format(content, {
    parser: "typescript",
    plugins: [],
  });
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
  const withoutExtension = trimFileExtensions(astroFiles);
  const withoutIndex = trimIndex(withoutExtension);
  const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
  const withLeading = addLeadingSlash(withoutTrailingSlash);
  return getDynamicRouteInfo(withLeading);
}

export type RunCodeGenOptions = {
  pagesPath: string;
  outPath: string;
  trailingSlash: boolean;
  name: string;
};

export async function runCodeGen(options: RunCodeGenOptions) {
  if (!isValidFunctionName(options.name)) {
    throw new Error("Invalid function name");
  }

  const routes = await getRoutes(options.pagesPath);

  const fileContent = await getRouteFileContent(routes, {
    trailingSlash: options.trailingSlash,
    functionName: options.name,
  });
  const formattedContent = await formatPrettier(fileContent);
  await writeRouteFile(options.outPath, formattedContent);

  logSuccess(options.outPath);

  return routes;
}

export function watch(path: string, callback: () => Promise<void>) {
  let watchPath = path;
  if (!watchPath.endsWith("/")) {
    watchPath += "/";
  }
  watchPath += "**/*.{astro,md,mdx,html}";

  const watcher = chokidar.watch(watchPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("add", callback);
  watcher.on("unlink", callback);
}

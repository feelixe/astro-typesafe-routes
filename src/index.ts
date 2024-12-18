import * as fs from "node:fs/promises";
import * as path from "path";
import * as prettier from "prettier";
import { AstroIntegration, AstroIntegrationLogger } from "astro";

export async function listAstroRouteFiles(dir: string) {
  const { default: fastGlob } = await import("fast-glob");
  const pattern = path.posix.join(dir, "**/*.{astro,md,mdx,html}");
  const files = await fastGlob(pattern);
  return files.map((el) => path.relative(dir, el));
}

export function normalizeSeparators(paths: string[]) {
  return paths.map((routePath) => routePath.replaceAll(path.sep, "/"));
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

export async function getRouteFileContent(routes: DynamicRoute[]) {
  const routeEntries = routes.map((route) => [
    route.path,
    { params: route.params },
  ]);
  const routesObject = Object.fromEntries(routeEntries);

  return `
  declare module "astro-typesafe-routes" {
    export type Routes = ${JSON.stringify(routesObject)};
  
    type Route = keyof Routes;
  
    type ParamsRecord<T extends Route> =
      Routes[T]["params"] extends Array<string>
        ? { [key in Routes[T]["params"][number]]: string }
        : null;
  
    type Options = {
      search?: ConstructorParameters<typeof URLSearchParams>[0];
      hash?: string;
      trailingSlash?: boolean;
    };

    type PathParameters<T extends Route> = Routes[T]["params"] extends null
      ? [pathName: T, options?: Options]
      : [
          pathName: T,
          options: Options & {
            params: ParamsRecord<T>;
          },
        ];

    export function $path<T extends Route>(...args: PathParameters<T>): string;
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

export async function getRoutes(pagesDir: string) {
  const routeFiles = await listAstroRouteFiles(pagesDir);
  const withNormalizedSeparators = normalizeSeparators(routeFiles);
  const withoutExtension = trimFileExtensions(withNormalizedSeparators);
  const withoutIndex = trimIndex(withoutExtension);
  const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
  const withLeading = addLeadingSlash(withoutTrailingSlash);
  return getDynamicRouteInfo(withLeading);
}

export type RunCodeGenOptions = {
  pagesDir: string;
  outputPath: string;
};

export async function runCodeGen(options: RunCodeGenOptions) {
  const routes = await getRoutes(options.pagesDir);

  const fileContent = await getRouteFileContent(routes);
  const formattedContent = await formatPrettier(fileContent);
  await writeRouteFile(options.outputPath, formattedContent);
  return routes;
}

export type PathParameters = [
  pathName: string,
  options?: {
    params?: Record<string, string>;
    trailingSlash?: boolean;
    search?: ConstructorParameters<typeof URLSearchParams>[0];
    hash?: string;
  },
];

export function $path(...args: PathParameters) {
  const [pathName, options] = args;
  const trailingSlash = options?.trailingSlash ?? false;

  let url: string = pathName;

  if (trailingSlash) {
    url += "/";
  }

  if (options?.params !== undefined) {
    for (const [paramKey, paramValue] of Object.entries<string>(
      options.params,
    )) {
      url = url.replace(`[${paramKey}]`, paramValue);
    }
  }

  const search = new URLSearchParams(options?.search);
  if (search.size > 0) {
    url += `?${search.toString()}`;
  }

  if (options?.hash !== undefined) {
    url += `#${options.hash}`;
  }

  return url;
}

export function logSuccess(logger: AstroIntegrationLogger, outputPath: string) {
  logger.info(`Generated route type to ${outputPath}`);
}

export type AstroTypesafeRoutesParameters = {
  outputPath?: string;
  pagesDir?: string;
};

const astroTypesafeRoutes = (
  opts?: AstroTypesafeRoutesParameters,
): AstroIntegration => {
  const codeGenOptions = {
    pagesDir: "./src/pages",
    outputPath: "./node_modules/astro-typesafe-routes.d.ts",
    ...opts,
  };

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:config:setup": async (args) => {
        await runCodeGen(codeGenOptions);
        logSuccess(args.logger, codeGenOptions.outputPath);

        args.updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-typesafe-routes",
                configureServer: (server) => {
                  server.watcher.on("add", async () => {
                    await runCodeGen(codeGenOptions);
                    logSuccess(args.logger, codeGenOptions.outputPath);
                  });
                  server.watcher.on("unlink", async () => {
                    await runCodeGen(codeGenOptions);
                    logSuccess(args.logger, codeGenOptions.outputPath);
                  });
                },
              },
            ],
          },
        });
      },
    },
  };
};

export default astroTypesafeRoutes;

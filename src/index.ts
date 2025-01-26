import {
  AstroIntegration,
  AstroIntegrationLogger,
  IntegrationResolvedRoute,
} from "astro";
import { writeFile } from "node:fs/promises";

export type Route = never;

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
declare module "astro-typesafe-routes/link" {
  import { HTMLAttributes } from "astro/types";
  import { RouteOptions, Route } from "astro-typesafe-routes";

  type LinkBaseProps = Omit<HTMLAttributes<"a">, "href">;

  export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;

  export default function Link<T extends Route>(props: LinkProps<T>): any;
}

declare module "astro-typesafe-routes" {
  import { AstroIntegration } from "astro";

  export type Routes = ${JSON.stringify(routesObject, null, 2)};

  export type Route = keyof Routes;

  export type ParamsRecord<T extends Route> =
    Routes[T]["params"] extends Array<string>
      ? { [key in Routes[T]["params"][number]]: string }
      : null;

  export type RouteOptions<T extends Route> = {
    to: T;
    search?: ConstructorParameters<typeof URLSearchParams>[0];
    hash?: string;
    trailingSlash?: boolean;
  } & (
    Routes[T]["params"] extends null ? {} : { params: ParamsRecord<T> }
  )

  export function $path<T extends Route>(args: RouteOptions<T>): string;

  export type AstroTypesafeRoutesParameters = {
    outputPath?: string;
    pagesDir?: string;
  };

  export default function astroTypesafeRoutes(
    opts?: AstroTypesafeRoutesParameters,
  ): AstroIntegration;
}`;
}

export type DynamicRoute = { path: string; params: string[] | null };

export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
};

export function getRoutes(args: GetRoutesParams): DynamicRoute[] {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal",
  );
  return withoutInternal.map((route) => ({
    path: route.pattern ?? "",
    params: route.params.length > 0 ? route.params : null,
  }));
}

export type GetDeclarationContentParam = {
  routes: IntegrationResolvedRoute[];
};

export async function getDeclarationContent(args: GetDeclarationContentParam) {
  const routes = await getRoutes(args);
  return await getRouteFileContent(routes);
}

export type RouteOptions = {
  to: string;
  search?: ConstructorParameters<typeof URLSearchParams>[0];
  hash?: string;
  trailingSlash?: boolean;
  params?: Record<string, string | number>;
};

export function $path(args: RouteOptions) {
  const trailingSlash = args.trailingSlash ?? false;

  let url: string = args.to;

  if (trailingSlash) {
    url += "/";
  }

  if (args?.params !== undefined) {
    for (const [paramKey, paramValue] of Object.entries(args.params)) {
      url = url.replace(`[${paramKey}]`, paramValue.toString());
    }
  }

  const search = new URLSearchParams(args?.search);
  if (search.size > 0) {
    url += `?${search.toString()}`;
  }

  if (args?.hash !== undefined) {
    const hash = args.hash.startsWith("#") ? args.hash.slice(1) : args.hash;
    url += `#${hash}`;
  }

  return url;
}

type WriteDeclarationFileParams = {
  path: string;
  content: string;
};

async function writeDeclarationFile(args: WriteDeclarationFileParams) {
  return await writeFile(args.path, args.content, { encoding: "utf-8" });
}

export function logSuccess(logger: AstroIntegrationLogger) {
  logger.info(`Generated route type`);
}

export default function astroTypesafeRoutes(): AstroIntegration {
  let routes: IntegrationResolvedRoute[] | undefined;
  let declarationUrl: URL | undefined;

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:routes:resolved": async (args) => {
        routes = args.routes;
        if (!declarationUrl) {
          return;
        }

        await writeDeclarationFile({
          path: declarationUrl.pathname,
          content: await getDeclarationContent({
            routes,
          }),
        });

        logSuccess(args.logger);
      },
      "astro:config:done": async (args) => {
        if (!routes) {
          let message = "Something went wrong, Astro routes were not resolved";
          args.logger.error(message);
          throw new Error(message);
        }

        declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: await getDeclarationContent({
            routes,
          }),
        });

        logSuccess(args.logger);
      },
    },
  };
}

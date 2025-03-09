import { AstroIntegrationLogger } from "astro";
import { ResolvedRoute } from "./types.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tryFormatPrettier } from "./format.js";
import { normalizeSeparators } from "./utils.js";

type WriteDeclarationFileParams = {
  filename: string;
  content: string;
};

export async function writeDeclarationFile(args: WriteDeclarationFileParams) {
  return await fs.writeFile(args.filename, args.content, { encoding: "utf-8" });
}

export function logSuccess(logger: AstroIntegrationLogger) {
  logger.info(`Generated route type`);
}

export type GetDeclarationContentParams = {
  routes: ResolvedRoute[];
  outPath: string;
};

export async function getDeclarationContent(args: GetDeclarationContentParams) {
  const rows = args.routes.map((route) => {
    let search = "null";
    if (route.hasSearchSchema) {
      const declarationDir = path.dirname(args.outPath);
      const relativeRoutePath = path.relative(
        declarationDir,
        route.absolutePath,
      );
      const normalizedSearchPath = normalizeSeparators(relativeRoutePath);
      search = `typeof import("${normalizedSearchPath}").searchSchema`;
    }
    return `"${route.path}": { params: ${JSON.stringify(
      route.params,
    )}; search: ${search} }`;
  });

  const routesType = `{${rows.join(",\n")}}`;

  const content = `
declare module "astro-typesafe-routes/link" {
  import { HTMLAttributes } from "astro/types";
  import { RouteOptions, Route } from "astro-typesafe-routes/path";

  type LinkBaseProps = Omit<HTMLAttributes<"a">, "href">;

  export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;

  export default function Link<T extends Route>(props: LinkProps<T>): any;
}

declare module "astro-typesafe-routes/link/react" {
  import { ComponentProps } from "react";
  import { RouteOptions, Route } from "astro-typesafe-routes/path";

  type LinkBaseProps = Omit<ComponentProps<"a">, "href">;

  export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;

  export default function Link<T extends Route>(props: LinkProps<T>): any;
}

declare module "astro-typesafe-routes/params" {
  import { AstroGlobal } from "astro";
  import { Route, Routes } from "astro-typesafe-routes/path";

  export function getParams<T extends Route>(
    astro: AstroGlobal,
    route: T,
  ): Routes[T]["params"] extends Array<unknown>
    ? { [key in Routes[T]["params"][number]]: string }
    : never;
}

declare module "astro-typesafe-routes/path" {
  import { StandardSchemaV1 } from "astro-typesafe-routes/standard-schema";

  export type Routes = ${routesType};

  export type Route = keyof Routes;

  export type ParamsRecord<T extends Route> =
    Routes[T]["params"] extends Array<string>
      ? { [key in Routes[T]["params"][number]]: string | number }
      : null;

  export type RouteOptions<T extends Route> = {
    to: T;
    hash?: string;
    trailingSlash?: boolean;
    searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
  } & (Routes[T]["search"] extends StandardSchemaV1
    ? { search: StandardSchemaV1.InferInput<Routes[T]["search"]> }
    : { search?: never }) &
    (Routes[T]["params"] extends null
      ? { params?: never }
      : { params: ParamsRecord<T> });

  export function $path<T extends Route>(args: RouteOptions<T>): string;
}
`;

  return await tryFormatPrettier(content);
}

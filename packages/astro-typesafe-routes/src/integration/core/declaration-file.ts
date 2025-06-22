import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { AstroIntegrationLogger } from "astro";
import type { ResolvedRoute } from "./types.js";
import { tryFormatPrettier } from "../helpers/format.js";
import { normalizeSeparators } from "../helpers/path.js";

type WriteDeclarationFileParams = {
  filename: string;
  content: string;
};

export async function writeDeclarationFile(args: WriteDeclarationFileParams) {
  return await fs.writeFile(args.filename, args.content, { encoding: "utf-8" });
}

export function logSuccess(logger: AstroIntegrationLogger) {
  logger.info("Generated route type");
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
      const relativeRoutePath = path.relative(declarationDir, route.absolutePath);
      const normalizedSearchPath = normalizeSeparators(relativeRoutePath);
      search = `typeof import("${normalizedSearchPath}").searchSchema`;
    }
    return `"${route.path}": { params: ${JSON.stringify(route.params)}; search: ${search} }`;
  });

  const routesType = `{${rows.join(",\n")}}`;

  const content = `

declare module "astro-typesafe-routes/link" {
  import type { HTMLAttributes } from "astro/types";
  import type { RouteOptions, Route } from "astro-typesafe-routes/path";

  type LinkBaseProps = Omit<HTMLAttributes<"a">, "href">;

  export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;

  export default function Link<T extends Route>(props: LinkProps<T>): any;
}

declare module "astro-typesafe-routes/link/react" {
  import type { ComponentProps } from "react";
  import type { RouteOptions, Route } from "astro-typesafe-routes/path";

  type LinkBaseProps = Omit<ComponentProps<"a">, "href">;

  export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;

  export default function Link<T extends Route>(props: LinkProps<T>): any;
}

declare module "astro-typesafe-routes/params" {
  import type { AstroGlobal } from "astro";
  import type { Route, Routes } from "astro-typesafe-routes/path";

  export function getParams<T extends Route>(
    astro: AstroGlobal,
    route: T,
  ): Routes[T]["params"] extends Array<unknown>
    ? { [key in Routes[T]["params"][number]]: string }
    : never;
}



declare module "astro-typesafe-routes/create-route" {
  import type { AstroGlobal } from "astro";
  import type { Route, Routes } from "astro-typesafe-routes/path";
  import type { StandardSchemaV1 } from "astro-typesafe-routes/standard-schema";

  export type CreateRouteOpts<S extends StandardSchemaV1> = {
    Astro: AstroGlobal;
    searchSchema?: S;
  };

  export function createRoute<T extends Route, S extends StandardSchemaV1>(
    routeId: T,
    opts: CreateRouteOpts<S>
  ): {
    params: Routes[T]["params"] extends null ? never : Record<Routes[T]["params"][number], string>;
    search: StandardSchemaV1.InferOutput<S>;
  };
}

declare module "astro-typesafe-routes/path" {
  import type { StandardSchemaV1 } from "astro-typesafe-routes/standard-schema";

  export type Routes = ${routesType};

  export type Route = keyof Routes;

  export type ParamsRecord<T extends Route> =
    Routes[T]["params"] extends Array<string>
      ? { [key in Routes[T]["params"][number]]: string | number }
      : null;

  type AreAllFieldsOptional<T> = {
    [K in keyof T]-?: undefined extends T[K] ? true : false;
  }[keyof T] extends true
    ? true
    : false;

  export type RouteOptions<T extends Route> = {
    to: T;
    hash?: string;
    trailingSlash?: boolean;
    searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
  } & (Routes[T]["search"] extends null
    ? { search?: never }
    : AreAllFieldsOptional<
          StandardSchemaV1.InferInput<Routes[T]["search"]>
        > extends true
      ? {
          search?: StandardSchemaV1.InferInput<Routes[T]["search"]>;
        }
      : {
          search: StandardSchemaV1.InferInput<Routes[T]["search"]>;
        }) &
    (Routes[T]["params"] extends null
      ? { params?: never }
      : { params: ParamsRecord<T> });

  export function $path<T extends Route>(args: RouteOptions<T>): string;
}
`;

  return await tryFormatPrettier(content);
}

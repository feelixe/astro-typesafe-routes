import { AstroIntegrationLogger } from "astro";
import { DynamicRoute } from "./types.js";
import * as fs from "node:fs/promises";

type WriteDeclarationFileParams = {
  path: string;
  content: string;
};

export async function writeDeclarationFile(args: WriteDeclarationFileParams) {
  return await fs.writeFile(args.path, args.content, { encoding: "utf-8" });
}

export function logSuccess(logger: AstroIntegrationLogger) {
  logger.info(`Generated route type`);
}

export async function getDeclarationContent(routes: DynamicRoute[]) {
  const routeEntries = routes.map((route) => [
    route.path,
    { params: route.params },
  ]);
  const routesObject = Object.fromEntries(routeEntries);

  return `
  declare module "astro-typesafe-routes/link" {
    import { HTMLAttributes } from "astro/types/path";
    import { RouteOptions, Route } from "astro-typesafe-routes/path";
  
    type LinkBaseProps = Omit<HTMLAttributes<"a">, "href">;
  
    export type LinkProps<T extends Route> = LinkBaseProps & RouteOptions<T>;
  
    export default function Link<T extends Route>(props: LinkProps<T>): any;
  }
  
  declare module "astro-typesafe-routes/path" {
    export type Routes = ${JSON.stringify(routesObject, null, 2)};
  
    export type Route = keyof Routes;
  
    export type ParamsRecord<T extends Route> =
      Routes[T]["params"] extends Array<string>
        ? { [key in Routes[T]["params"][number]]: string | number }
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
  }`;
}

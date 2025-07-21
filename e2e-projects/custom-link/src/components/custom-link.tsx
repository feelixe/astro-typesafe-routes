import { $path, type RouteId, type RouteOptions } from "astro-typesafe-routes/path";
import type { ComponentProps } from "react";

export type CustomReactLinkProps<T extends RouteId> = Omit<ComponentProps<"a">, "href"> &
  RouteOptions<T>;

export function CustomReactLink<T extends RouteId>(props: CustomReactLinkProps<T>) {
  const { to, params, search, searchParams, hash, trailingSlash, ...rest } = props;

  const link = {
    to,
    params,
    search,
    searchParams,
    hash,
    trailingSlash,
  } as RouteOptions<T>;

  const href = $path(link);

  return (
    <a href={href} {...rest}>
      123
    </a>
  );
}

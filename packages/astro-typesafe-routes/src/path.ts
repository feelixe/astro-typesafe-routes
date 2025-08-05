/// <reference types="vite/client" />
import { serialize } from "./search-serializer.js";

export type RouteId = string;

export type RouteOptions = {
  to: string;
  searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
  search?: Record<string, unknown>;
  hash?: string;
  trailingSlash?: boolean;
  params?: Record<string, string | number>;
};

export function $path(args: RouteOptions) {
  const baseUrl = import.meta.env.BASE_URL;
  let url = baseUrl.replace(/\/$/, "") + args.to;

  const trailingSlashConfig = import.meta.env.TRAILING_SLASH ?? "ignore";
  const defaultTrailingSlash = trailingSlashConfig === "always";
  const shouldAddTrailingSlash = args.trailingSlash ?? defaultTrailingSlash;

  const hasTrailingSlash = url.endsWith("/");
  if (shouldAddTrailingSlash && !hasTrailingSlash) {
    url += "/";
  }

  if (args.params !== undefined) {
    for (const [paramKey, paramValue] of Object.entries(args.params)) {
      url = url.replace(
        new RegExp(
          // Disregard spread operators when matching params
          `\\[(\\.{3})?${paramKey}\\]`,
        ),
        paramValue.toString(),
      );
    }
  }

  if (args.search) {
    const search = serialize(args.search);
    url += `?${search.toString()}`;
  }

  const searchParams = new URLSearchParams(args?.searchParams);
  if (searchParams.size > 0 && !args.search) {
    url += `?${searchParams.toString()}`;
  }

  if (args.hash !== undefined) {
    const hash = args.hash.startsWith("#") ? args.hash.slice(1) : args.hash;
    url += `#${hash}`;
  }

  return url;
}

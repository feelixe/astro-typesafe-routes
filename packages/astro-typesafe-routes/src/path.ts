import { serialize } from "./search-serializer.js";

export type RouteOptions = {
  to: string;
  searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
  search?: Record<string, unknown>;
  hash?: string;
  trailingSlash?: boolean;
  params?: Record<string, string | number>;
};

export function $path(args: RouteOptions) {
  // @ts-expect-error Can't recognise import.meta.env
  const baseUrl: string = import.meta.env.BASE_URL;
  const trailingSlash = args.trailingSlash ?? false;

  let url = baseUrl.replace(/\/$/, "") + args.to;

  if (trailingSlash) {
    url += "/";
  }

  if (args.params !== undefined) {
    for (const [paramKey, paramValue] of Object.entries(args.params)) {
      url = url.replace(`[${paramKey}]`, paramValue.toString());
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

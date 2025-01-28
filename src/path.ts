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

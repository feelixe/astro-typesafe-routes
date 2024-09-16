
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

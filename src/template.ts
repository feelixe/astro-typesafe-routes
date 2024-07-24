export type Routes = {};

const defaultTrailingSlash = false;

type Route = keyof Routes;

type ParamsRecord<T extends Route> =
  Routes[T]["params"] extends Array<string>
    ? { [key in Routes[T]["params"][number]]: string }
    : null;

type PathParameters<T extends Route> = (Routes[T]["params"] extends null
  ? void
  : { params: ParamsRecord<T> }) & {
  search?: string | URLSearchParams;
  hash?: string;
  trailingSlash?: boolean;
  path: T;
};

export function $path<T extends Route>(args: PathParameters<T>) {
  const trailingSlash = args.trailingSlash ?? defaultTrailingSlash;

  let url: string = args.path;

  if(trailingSlash) {
    url += "/";
  }

  if ("params" in args && args.params !== null) {
    for (const [paramKey, paramValue] of Object.entries<string>(args.params)) {
      url = url.replace(`[${paramKey}]`, paramValue);
    }
  }
  
  if (args.search !== undefined) {
    const search =
      typeof args.search === "string"
        ? new URLSearchParams(args.search)
        : args.search;
    url += `?${search.toString()}`;
  }

  if (args.hash !== undefined) {
    url += `#${args.hash}`;
  }

  return url;
}

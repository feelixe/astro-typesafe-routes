import type { RouteId } from "astro-typesafe-routes/path";

export const versions = ["v4.0.0", "v5.0.0"] as const;

export type Version = (typeof versions)[number];

type VersionGroup = Array<{
  version: Version;
  routeId: RouteId;
}>;

type RouteMap = Array<VersionGroup>;

export const routeMap: RouteMap = [
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation",
    },
  ],
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation/configuration",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation/configuration",
    },
  ],
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation/migrating",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation/migrating",
    },
  ],
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation/usage/link",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation/usage/link",
    },
  ],
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation/usage/path",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation/usage/path",
    },
  ],
  [
    {
      version: "v4.0.0",
      routeId: "/4.0.0/documentation/usage/typed-search-params",
    },
    {
      version: "v5.0.0",
      routeId: "/documentation/usage/typed-search-params",
    },
  ],
];

const fallbackGroup: VersionGroup = [
  {
    version: "v4.0.0",
    routeId: "/4.0.0/documentation",
  },
  {
    version: "v5.0.0",
    routeId: "/documentation",
  },
];

function resolveFallback(version: Version) {
  const route = fallbackGroup.find((route) => route.version === version);
  if (!route) {
    throw new Error(`Unsupported version "${version}", no fallback route found.`);
  }
  return route.routeId;
}

export function resolveVersionedRoute(routeId: RouteId, version: Version) {
  const group = routeMap.find((group) => group.some((route) => route.routeId === routeId));
  const route = group?.find((route) => route.version === version);
  if (!route) {
    return resolveFallback(version);
  }
  return route.routeId;
}

# Migrating from 4.0.0

This section outlines the breaking changes introduced since version 4 of Astro Typesafe Routes. Review the details below to ensure a smooth upgrade.

<br />

## Astro

Support for Astro `^4.0.0` has been dropped. Please upgrade to `^5.0.0` to stay compatible.

<br />

## Reading Params

Getting typed params now use `createRoute` and `Route.getParams` instead.

```tsx
const { id } = getParams(Astro, "/[id]");
```

Replace with:

```tsx
const Route = createRoute({
  routeId: "/blog/[id]",
});

const { id } = Route.getParams(Astro);
```

<br />

## Search Schema

The search schema is now declared inside `createRoute`.

```ts
export const searchSchema = z.object({ limit: z.number() });
```

Replace with:

```ts
export const Route = createRoute({
  routeId: "/",
  searchSchema: z.object({ limit: z.number() }),
});
```

<br />

## Reading Search Params

Typed search params are now accessed from `Route.getSearch`.

```ts
const search = getSearch(Astro, searchSchema);
```

Replace with:

```ts
const search = Route.getSearch(Astro);
```

<br />

## Route Type

The type `Route` has been renamed to `RouteId`.

```ts
import { Route } from "astro-typesafe-routes/path";
```

Replace with:

```ts
import { RouteId } from "astro-typesafe-routes/path";
```

<br />

## Spread params

Spread params are now passed without the `...` prefix.

```tsx
<Link to="/blog/[...path]" params={{ "...path": "about" }}>
  Blog
</Link>
```

Replace with:

```tsx
<Link to="/blog/[...path]" params={{ path: "about" }}>
  Blog
</Link>
```

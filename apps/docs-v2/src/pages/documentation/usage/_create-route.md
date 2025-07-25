# Create Route

With `createRoute` you get access to typesafe params,
search params, `redirect`, `rewrite` and even `getStaticPaths`.

## Reading Params

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

const { postId } = Route.getParams(Astro);
```

<br />

## Search Params

```ts
import { createRoute } from "astro-typesafe-routes/create-route";
import { z } from "astro/zod";

export const Route = createRoute({
  routeId: "/blog/[postId]",
  searchSchema: z.object({ num: z.number() }),
});

const search = Route.getSearch(Astro);
```

<br />

## Redirect

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

return Route.redirect(Astro, { to: "/" });
```

<br />

## Rewrite

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

return Route.rewrite(Astro, { to: "/" });
```

<br />

## Typesafe `getStaticPaths`

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

export const getStaticPaths = Route.createGetStaticPaths(() => [
  {
    params: {
      postId: "1",
    },
  },
]);
```

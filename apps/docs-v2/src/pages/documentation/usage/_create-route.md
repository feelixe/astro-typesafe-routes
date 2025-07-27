# Create Route

With `createRoute` you get access to typesafe params,
search params, `redirect`, `rewrite` and even `getStaticPaths`.

<br />

## Creating a Route

To create a route, export a constant called `Route` so Astro Typesafe Routes can detect it.

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});
```

<br />

## Reading Params

You can read typed params by calling `getParams` on your created route.

```ts
import { createRoute } from "astro-typesafe-routes/create-route";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

const { postId } = Route.getParams(Astro);
```

<br />

## Search Params

Add typed and JSON serialized search params to your route by adding a searchSchema.
More details can be found <a href="/documentation/usage/typed-search-params">here</a>.

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

---
sidebar_position: 2
---

# Basic Usage

## Automatic Generation
Astro Typesafe Routes will automatically update the `routeId` of changed routes. If you want to disable this, you can set `disableAutomaticRouteUpdates` in the integration options.
```tsx
export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      disableAutomaticRouteUpdates: true,
    }),
  ],
});
```

## Links
To link to a page with typed URLs, import the `Link` component.
```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[postId]" params={{ postId: "1" }}>Post</Link>
```

## Reading Params
To safely read route params with proper types, create a `Route`.
```tsx
---
import { createRoute } from "astro-typesafe-routes/route-schema";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

const params = Route.getParams(Astro);
---
```

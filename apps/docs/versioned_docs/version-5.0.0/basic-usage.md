---
sidebar_position: 2
---

# Basic Usage

## Automatic Generation
Astro Typesafe Routes will automatically populate new routes with boilerplate and update the `routeId` of changed routes. If you want to disable this, you can set `disableRouteGeneration` in the integration options.
```tsx
export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      disableRouteGeneration: true,
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

<Link to="/blog/[postId]" params={{ postId: "1" }}>About</Link>
```

## Reading Params
To safely read route params with proper types, define a `routeSchema`.
```tsx
---
import { createRouteSchema } from "astro-typesafe-routes/route-schema";

export const routeSchema = createRouteSchema({
  routeId: "/blog/[postId]",
});

const { params } = routeSchema.parse(Astro);

params.postId;
---
```

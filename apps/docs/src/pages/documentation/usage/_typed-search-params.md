# Typed Search Params

> Astro only supports search params on routes that are server-side-rendered.

You can add typed search params in your project by adding a `searchSchema` in the route.

<br />

## Declaring Search Schema

Start by adding any [Standard Schema](https://github.com/standard-schema/standard-schema?tab=readme-ov-file#what-schema-libraries-implement-the-spec) compliant schema to your route.

The schema must be an object at the root, but that fields inside that object can be any JSON serializable type.

Astro Typesafe Routes will serialize and deserialize the search params internally.

```ts
---
import { createRoute } from "astro-typesafe-routes/create-route";
import { z } from "astro:content";

export const Route = createRoute({
  routeId: "/",
  searchSchema: z.object({
    limit: z.number(),
    filter: z.string(),
  })
});
---
```

<br />

## Reading Search Params

You can read the typesafe and deserialized search params by calling `Route.getSearch`.

```ts
---
import { createRoute } from "astro-typesafe-routes/create-route";
import { z } from "astro:content";

export const Route = createRoute({
  routeId: "/",
  searchSchema: z.object({
    limit: z.number(),
    filter: z.string(),
  })
});

const search = Route.getSearch(Astro);
---
```

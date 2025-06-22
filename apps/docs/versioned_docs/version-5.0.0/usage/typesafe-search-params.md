---
sidebar_position: 5
---
# Typesafe Search Params
Astro Typesafe Routes supports generation types for typesafe search params.

* Only supported when using [on-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
* Typed search params are optional, if you want to pass untyped search params, use field `searchParams` instead.

## Setup

1. Add a [Standard Schema](https://github.com/standard-schema/standard-schema?tab=readme-ov-file#what-schema-libraries-implement-the-spec) (Zod, Valibot etc.) compatible schema to the route schema. The top most type of the schema must be an `object`. While the inner fields can be nested and of any type that is JSON serializable:
    ```tsx
    ---
    import { createRouteSchema } from "astro-typesafe-routes/create-route";
    import { z } from "astro/zod";

    export const routeSchema = createRouteSchema({
      routeId: "/",
      searchSchema: z.object({
        limit: z.number(),
      }),
    });
    ---
    ```

2. It is usually a good practice to have optional search params or catch errors to avoid crashing the page if invalid search params are received.
    ```tsx
    ---
    import { createRouteSchema } from "astro-typesafe-routes/create-route";
    import { z } from "astro/zod";

    export const routeSchema = createRouteSchema({
      routeId: "/",
      searchSchema: z.object({
        limit: z.number().catch(1),
      }),
    });
    ---
    ```

3. When linking to the page, pass the required search params to field `search`. Typescript will give an error if field `search` does not match the schema's input:
    ```tsx
    // src/pages/my-other-route.astro
    ---
    import Link from "astro-typesafe-routes/link";
    ---
    <Link
      to="/"
      search={{
        isActive: true,
        filter: "active",
      }}
    >
      Hit me!
    </Link>
    ```

4. Link's search params will be JSON serialized:
    ```
    /?isActive=true&filter=active
    ```

5. To read the search params, call `parse` on the route schema.
    ```tsx
    ---
    import { createRouteSchema } from "astro-typesafe-routes/   create-route";
    import { z } from "astro/zod";

    export const routeSchema = createRouteSchema({
      routeId: "/",
      searchSchema: z.object({
        limit: z.number().catch(1),
      }),
    });

    const { search } = routeSchema.parse(Astro);

    search.limit;
    ---
    ```

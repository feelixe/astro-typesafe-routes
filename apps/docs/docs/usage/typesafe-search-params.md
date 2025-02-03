---
sidebar_position: 5
---
# Typesafe Search Params
Astro Typesafe Routes supports generation types for typesafe search params.

* Only supported when using [on-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
* Typed search params are optional, if you want to pass untyped search params, use field `searchParams` instead.
* Added in: `astro-typesafe-routes@4.0.0`

Follow the steps below to setup typesafe search params for a route.

1. Export a zod schema called `searchSchema`. The schema must start with a `z.object`. While the inner fields can be nested and of any type that is JSON serializable:
    ```tsx
    // src/pages/my-route.astro
    ---
    import { z } from "astro/zod";

    export const searchSchema = z.object({
      filter: z
        .string(),
      isActive: z.boolean(),
    });
    ---
    ```

2. It is usually a good practice to have optional search params or catch errors to avoid crashing the page if invalid search params are received.
    ```tsx
    // src/pages/my-route.astro
    ---
    import { z } from "astro/zod";
    
    export const searchSchema = z.object({
      filter: z
        .string()
        .optional()
        .catch(() => undefined),
      isActive: z.boolean().catch(false),
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
    /?isActive=true&filter=%22active%22
    ```

5. To read the search params, use the function `getSearch`, which will handle deserialization and parsing:
    ```tsx
    // src/pages/my-route.astro
    ---
    import { z } from "astro/zod";
    import { getSearch } from "astro-typesafe-routes";

    export const searchSchema = z.object({
      filter: z.string().catch("all"),
      isActive: z.boolean().catch(false),
    });

    const search = getSearch(Astro, searchSchema);
    ---
    ```
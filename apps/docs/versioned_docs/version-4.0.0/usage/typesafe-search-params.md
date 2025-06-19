---
sidebar_position: 5
---
# Typesafe Search Params
Astro Typesafe Routes supports generation types for typesafe search params.

* Only supported when using [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
* Typed search params are optional, if you want to pass untyped search params, use field `searchParams` instead.
* Added in: `astro-typesafe-routes@4.0.0`
* Schema validation uses [Standard Schema](https://github.com/standard-schema/standard-schema?tab=readme-ov-file). A [supported schema library](https://github.com/standard-schema/standard-schema?tab=readme-ov-file#what-schema-libraries-implement-the-spec) is required.

Follow the steps below to setup typesafe search params for a route.
1. Install a schema library that supports [Standard Schema](https://github.com/standard-schema/standard-schema?tab=readme-ov-file#what-schema-libraries-implement-the-spec). Astro comes with Zod which will be used below, but any other library that supports Standard Schema can be used.
   
2. Export a schema called `searchSchema`. Root of schema must be an object. While the inner fields can be nested and of any type that is JSON serializable:
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

3. It is usually a good practice to have optional search params or catch errors to avoid crashing the page if invalid search params are received.
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

4. When linking to the page, pass the required search params to field `search`. Typescript will give an error if field `search` does not match the schema's input:
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

5. Link's search params will be JSON serialized:
    ```
    /?isActive=true&filter=%22active%22
    ```

6. To read the search params, use the function `getSearch`, which will handle deserialization and parsing:
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
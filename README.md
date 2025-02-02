<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">
  Enhance your Astro development experience with rigorous type safety for every route in your application. This integration automatically generates TypeScript definitions from your project's route structure.
  <br />
  <br />
  <a href="https://badge.fury.io/js/astro-typesafe-routes"><img src="https://badge.fury.io/js/astro-typesafe-routes.svg?icon=si%3Anpm" alt="npm version" height="18"></a>
</p>

<div align="center">
  <img src="https://i.ibb.co/g3k4NfN/ezgif-4-b7d48fa603.gif" alt="Usage demo">
</div>

---
## Table of Contents
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Manual Installation](#manual-installation)
- [Usage](#usage)
  - [Link Component](#link-component)
  - [Path Function](#path-function)
  - [Optional Fields](#optional-fields)
- [Typed Custom Component Props](#typed-custom-component-props)
- [Typesafe Search Params](#typesafe-search-params)
- [Configurations](#configurations)


## Features
* 🛟 **Typesafe:** Ensures all URLs matches a route in your Astro project.
* 🔗 **Typed Link Component:** Replace your anchor links with the typesafe `Link` component.
* 🔎 **Typesafe Search Params**: Support for typesafe and JSON serialized search params when using a SSR adapter.
* 🛠️ **Automatic Type Generation**: Simple installation as an Astro integration.
* 🧩 **Custom Component Support**: Add type safety to custom links with the types `Route` and `RouteOptions`.

## Requirements
Compatible with Astro version 4 and 5, with a minimum of `4.14.0`.

## Installation
1. Add integration:
```bash
npx astro add astro-typesafe-routes
```
2. Start the Astro development server if it's not already running to run type generation:
```bash
npm run dev
```

## Manual Installation
1. Install package:
```sh
npm install -D astro-typesafe-routes
```
2. Add integration to `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import astroTypesafeRoutes from "astro-typesafe-routes"

export default defineConfig({
  integrations: [
    astroTypesafeRoutes()
  ]
});
```
3. Start the Astro development server if it's not already running to run code generation:
```bash
npm run dev
```


## Usage
### Link Component
Import the `Link` component and use it as a drop-in replacement for links.
```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

### Path Function
If you can't or don't want to use the `Link` component, you can use the `$path` function to ensure safe URLs.
```typescript
---
import { $path } from "astro-typesafe-routes/path";
---

<a href={$path({ to: "/blog/[id]", params: { id: "4" } })}>
  Blog Post
</a>
```

### Optional Fields
Both the `$path` function and `Link` component also accepts the optional fields `searchParams`, `hash` and `trailingSlash`.

```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link
  to="/blog/[id]"
  params={{ id: "4" }}
  hash="header"
  searchParams={{ filter: "recent" }}
>
  Slug here
</Link>
```

## Typed Custom Component Props
Import `Route` and `RouteOptions` types to add type safety to your custom link components:

```typescript
---
import type { HTMLAttributes } from "astro/types";
import type { RouteOptions, Route } from "astro-typesafe-routes/path";
import { $path } from "astro-typesafe-routes/path";

export type Props<T extends Route> = Omit<HTMLAttributes<"a">, "href"> &
  RouteOptions<T>;

const { to, params, search, searchParams, hash, trailingSlash, ...anchorProps } = Astro.props;
const href = $path({ to, params, search, searchParams, hash, trailingSlash });
---

<a href={href} {...anchorProps}>
  <slot />
</a>
```

## Typesafe Search Params
> • Typed search params are optional, if you which to pass untyped search params, use field `searchParams` instead.
> • Only supported when using [On-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/).
> • Added in: `astro-typesafe-routes@4.0.0`

1. To add typesafe search params to a route, export a zod schema called `searchSchema`. Must start with a `z.object`. The inner fields can be nested and of any type that is JSON serializable:
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
2. It is usually a good practice to catch errors when validating search params and fallback to default value:
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

3. When linking to the page, Typescript will give an error if field `search` does not match the schema's input:
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
4. Link's search will be JSON serialized:
```
/?isActive=true&filter=%22active%22
```
5. To read the search params, use the function `getSearch`:
```tsx
// src/pages/my-route.astro
---
import { z } from "astro/zod";
import { getSearch } from "astro-typesafe-routes/search";

export const searchSchema = z.object({
  filter: z.string().catch("all"),
  isActive: z.boolean().catch(false),
});

const search = getSearch(Astro, searchSchema);
---
```

## Configurations
This integration automatically detects the running Astro major version for compatibility. If it should detect the wrong version you can pass an override as argument to the integration.
```typescript
export default defineConfig({
  integrations: [astroTypesafeRoutes({
    astroVersion: 4
  })],
});
```

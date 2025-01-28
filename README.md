<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">Astro Integration for typesafe URLs</p>

<div align="center">
  <img src="https://i.ibb.co/g3k4NfN/ezgif-4-b7d48fa603.gif" alt="Usage demo">
</div>

---
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
Import the `Link` component and use it as a drop-in replacement for links.
```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

If you can't or don't want to use the `Link` component, you can use the `$path` function to ensure safe URLs.
```typescript
---
import { $path } from "astro-typesafe-routes/path";
---

<a href={$path({ to: "/blog/[id]", params: { id: "4" } })}>
  Blog Post
</a>
```

Both the `$path` function and `Link` component also accepts the optional fields `search`, `hash` and `trailingSlash`.

```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link
  to="/blog/[id]"
  params={{ id: "4" }}
  hash="header"
  search={{ filter: "recent" }}
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

const { to, params, search, hash, trailingSlash, ...anchorProps } = Astro.props;
const href = $path({ to, params, search, hash, trailingSlash });
---

<a href={href} {...anchorProps}>
  <slot />
</a>
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

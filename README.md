<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">Astro Integration for typesafe URLs</p>

<div align="center">
  <img src="https://i.imgur.com/aSNlJ7O.gif" alt="Usage demo">
</div>

---

## Installation
1. Install package
```sh
npm install -D astro-typesafe-routes
```
2. Add integration to `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import { astroTypesafeRoutes } from "astro-typesafe-routes"

export default defineConfig({
    integrations: [
        astroTypesafeRoutes()
    ]
});
```

## Usage
Import the path function and use it as a drop in replacement on links and anywhere else you would use a URL.
```typescript
---
import { $path } from "astro-typesafe-routes";
---

<a href={$path("/posts/[postId]", { params: { postId: "1" } })}>
  Blog Post
</a>
```

The generated function also accepts the fields `search`, `hash` and `trailingSlash`.

```typescript
---
import { $path } from "astro-typesafe-routes";
---

<a
  href={$path("/posts/[postId]", {
    params: { postId: "1" },
    hash: "header",
    search: { filter: "recent" },
    trailingSlash: true
  })}
>
  Blog Post
</a>

```

## Options
The Astro integration accepts the some optional options.
- `outputPath` - Path to the declaration file that will be generated (defaults to `./node_modules/astro-typesafe-routes.d.ts`).
- `pagesDir` - Directory of your Astro pages (defaults to `./src/pages`).


## Credit
Inspiration taken from [yesmeck/remix-routes](https://github.com/yesmeck/remix-routes).
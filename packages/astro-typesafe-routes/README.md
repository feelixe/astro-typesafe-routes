<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">
  <sub>Enhance your Astro development experience with rigorous type safety for every route in your application. This integration automatically generates TypeScript definitions from your project's route structure.
  </sub>
  <br />
  <br />
  <a href="https://www.npmjs.com/package/astro-typesafe-routes"><img src="https://badge.fury.io/js/astro-typesafe-routes.svg?icon=si%3Anpm" alt="npm version" height="18"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" height="18" /></a>
</p>

<p align="center">
  <a href="https://astro-typesafe-routes.feelixe.com">Documentation</a>
  •
  <a href="https://www.npmjs.com/package/astro-typesafe-routes">npm</a>
  •
  <a href="https://github.com/feelixe/astro-typesafe-routes">GitHub</a>
</p>

<div align="center">
  <img src="https://i.ibb.co/g3k4NfN/ezgif-4-b7d48fa603.gif" alt="Usage demo">
</div>

---

## Features

- 🛟 **Typesafe** — Ensures all URLs match a route in your Astro project.
- 🔗 **Typed Link Component** — Replace your anchor links with the typesafe `Link` component.
- 🔎 **Typesafe Search Params** — Support for typesafe and JSON serialized search params.
- 🧩 **Custom Component Support** — Add type safety to custom link components.
- 🤸 **Zero Dependencies** — No 3rd-party packages.

## Prerequisites

1. **Astro** `^5.0.0` is required
2. Install **Typescript** and **Astro Check**

```bash
npm i -D typescript @astrojs/check
```

3. Add `astro check` command to build script in `package.json`

```json
{
  "scripts": {
    "build": "astro check && astro build"
  }
}
```

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

If automatic installation didn’t work, follow these steps:

1. Install package:

```sh
npm install astro-typesafe-routes
```

2. Add integration to `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";

export default defineConfig({
  integrations: [astroTypesafeRoutes()],
});
```

3. Start the Astro development server if it's not already running to run code generation:

```bash
npm run dev
```

## Basic Usage

### Link

Import the `Link` component to create a typesafe link

```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[postId]" params={{ postId: "1" }}>Post</Link>
```

### Reading Params

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

### Typesafe GetStaticPaths

```tsx
---
import { createRoute } from "astro-typesafe-routes/create-route";
import { z } from "astro/zod";

export const Route = createRoute({
  routeId: "/blog/[postId]",
});

export type Props = {
  content: string;
};

export const getStaticPaths = Route.createGetStaticPaths<Props>(() => {
  return [
    {
      params: {
        postId: "1",
      },
      props: {
        content: "Lorem Ipsum",
      },
    },
  ];
});
---

{Astro.props.content}
```

## Advanced Usage

For more in-depth information and detailed usage instructions, please refer to the [documentation](https://astro-typesafe-routes.feelixe.com/documentation).

## Automatic Route Updates

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

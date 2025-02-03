<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">
  Enhance your Astro development experience with rigorous type safety for every route in your application. This integration automatically generates TypeScript definitions from your project's route structure.
  <br />
  <br />
  <a href="https://www.npmjs.com/package/astro-typesafe-routes"><img src="https://badge.fury.io/js/astro-typesafe-routes.svg?icon=si%3Anpm" alt="npm version" height="18"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" height="18" /></a>
</p>

<p align="center">
  <a href="https://astro-typesafe-routes-docs.vercel.app/">Documentation</a>
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
### Usage
Import the Link component and enjoy typesafe urls.
```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

### Advanced Usage
For more in-depth information and detailed usage instructions, please refer to the [documentation](https://astro-typesafe-routes-docs.vercel.app/).
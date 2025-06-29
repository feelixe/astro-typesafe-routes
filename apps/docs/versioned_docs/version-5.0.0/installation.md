---
sidebar_position: 1
---

# Installation
Astro Typesafe Routes integrates seamlessly into your Astro project, offering automatic type safety for your routes. Ensure your project uses Astro version 5.0.0 or higher. Follow the steps below to set it up and enhance your development experience.

## Prerequisites
1. **Astro** `^5.0.0` is required
2. Install **Typescript** and **Astro Check**
```bash
npm i -D typescript @astrojs/check
```
4. Add `astro check` command to build script in `package.json`
```json
{
  "scripts": {
    "build": "astro check && astro build",
  }
}
```

## Automatic Installation
1. Add integration:
```bash
npx astro add astro-typesafe-routes
```
2. Start the Astro development server if it's not already running to run type generation:
```bash
npm run dev
```
3. Done! If you ran into any issues, try manual installation.

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
4. Done!

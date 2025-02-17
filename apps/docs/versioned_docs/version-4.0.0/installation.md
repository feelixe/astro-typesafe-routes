---
sidebar_position: 1
---

# Installation
Astro Typesafe Routes integrates seamlessly into your Astro project, offering automatic type safety for your routes. Ensure your project uses Astro version 4.14.0 or higher (compatible with v4 and v5). Follow the steps below to set it up and enhance your development experience.

## Requirements
* Astro Typesafe Routes is compatible with Astro version 4 and 5, with a minimum of 4.14.0.
* **Astro** and **Typescript** are required peer dependencies.
  
## Automatic Installation
1. Setup [Typescript for Astro](https://docs.astro.build/en/guides/typescript/).
2. Add integration:
```bash
npx astro add astro-typesafe-routes
```
3. Start the Astro development server if it's not already running to run type generation:
```bash
npm run dev
```
4. Done! If you ran into any issues, try manual installation.
   
## Manual Installation
1. Setup [Typescript for Astro](https://docs.astro.build/en/guides/typescript/).
2. Install package:
```sh
npm install astro-typesafe-routes
```
3. Add integration to `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import astroTypesafeRoutes from "astro-typesafe-routes"

export default defineConfig({
  integrations: [
    astroTypesafeRoutes()
  ]
});
```
4. Start the Astro development server if it's not already running to run code generation:
```bash
npm run dev
```
5. Done!
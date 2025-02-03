---
sidebar_position: 1
---

# Installation
  
## Automatic Installation
1. Add integration:
```bash
npx astro add astro-typesafe-routes
```
3. Start the Astro development server if it's not already running to run type generation:
```bash
npm run dev
```
   
## Manual Installation
1. Install Typescript if it's not already installed.
```bash
npm i -D typescript
```
2. Install package:
```sh
npm install -D astro-typesafe-routes
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
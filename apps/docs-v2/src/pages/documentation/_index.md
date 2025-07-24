# Installation

Astro Typesafe Routes integrates seamlessly into your Astro project,
offering automatic type safety for your routes. Ensure your project
uses Astro version 4.14.0 or higher (compatible with v4 and v5).
Follow the steps below to set it up and enhance your development experience.

<br />

## Prerequisites

1. Astro `^5.0.0` is required
2. Install **Typescript** and **Astro Check**

```
npm i -D typescript @astrojs/check
```

3. Add `astro check` command to build script in package.json

```json
{
  "scripts": {
    "build": "astro check && astro build"
  }
}
```

<br />

## Installation

1. Add integration:

```
npx astro add astro-typesafe-routes
```

2. Start the Astro development server if it's not already running to run type generation:

```
npm run dev
```

<br />

## Manual Installation

If automatic installation didn’t work, follow these steps:

1. Install package:

```
npm install astro-typesafe-routes
```

2. Add integration to astro.config.mjs:

```js
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";

export default defineConfig({
  integrations: [astroTypesafeRoutes()],
});
```

3. Start the Astro development server if it's not already running to run code generation:

```
npm run dev
```

<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">A CLI for generating a Typesafe Astro path function.</p>

<div align="center">
  <img src="https://i.imgur.com/Hc32hhK.gif" alt="Usage demo">
</div>


---

## Installation
1. Install package
```sh
npm install -D astro-typesafe-routes
```
2. Add script to `package.json`
```json
"scripts": {
  "generate-routes": "astro-typesafe-routes generate"
}
```
3. Execute the script to run codegeneration
```sh
npm run generate-routes
```

## Usage
Import the generated function and use it as a drop in replacement on links and anywhere else you would use a URL.
```typescript
---
import { $path } from "../astro-typesafe-routes";

---

<a href={$path({ path: "/posts/[postId]", params: { postId: "1" } })}>
  Blog Post
</a>
```

The generated function also accepts the fields `search`, `hash` and `trailingSlash`.

```typescript
---
import { $path } from "../astro-typesafe-routes";
---

<a
  href={$path({
    path: "/posts/[postId]",
    params: { postId: "1" },
    hash: "body",
    search: new URLSearchParams({ filter: "recent" }),
    trailingSlash: true
  })}
>
  Blog Post
</a>

```

## CLI Options
- `generate` - Run code generation.
  - `-n, --name` - Name of the generated function, defaults to `$path`. 
  - `-t, --trailing-slash` - Default to adding trailing slash to URLs.
  - `-p, --pages-path <string>` - Path to Astro pages directory.
  - `-o, --out-path <string>` - Path to codegen to.
  - `-h, --help` - Show help

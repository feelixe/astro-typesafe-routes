<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">A CLI for generating Typesafe URLs in Astro</p>

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
3. Execute the script to run code generation
```sh
npm run generate-routes
```

## Usage
Import the generated function and use it as a drop in replacement on links and anywhere else you would use a URL.
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

## CLI Options
- `generate` - Run code generation.
  - `-p, --pages-path <string>` - Path to Astro pages directory.
  - `-o, --out-path <string>` - Path to codegen to.
  - `-w, --watch` - Watch for changes in pages folder.
  - `-h, --help` - Show help.

---
sidebar_position: 1
---
# Optional Fields
The path function also accepts the optional fields `search`, `hash` and `trailingSlash`.
```tsx
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
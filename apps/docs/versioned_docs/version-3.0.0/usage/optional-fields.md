---
sidebar_position: 3
---
# Optional Fields
Both the `$path` function and `Link` component support the optional fields `search`, `hash`, and `trailingSlash`.
```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link
  to="/blog/[id]"
  params={{ id: "4" }}
  hash="header"
  search={{ filter: "recent" }}
>
  Slug here
</Link>
```
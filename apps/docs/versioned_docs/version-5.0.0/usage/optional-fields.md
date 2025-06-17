---
sidebar_position: 3
---
# Optional Fields
Both the `$path` function and `Link` component support the optional fields `searchParams`, `hash`, and `trailingSlash`.
```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link
  to="/blog"
  hash="header"
  searchParams={{ filter: "recent" }}
  trailingSlash
>
  Slug here
</Link>
```
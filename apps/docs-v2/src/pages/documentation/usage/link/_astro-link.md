# Link

Use the Link component from astro-typesafe-routes to enable type-safe navigation.

```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

If you need a Link in a React component, use the React Link instead.

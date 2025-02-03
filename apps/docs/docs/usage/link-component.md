---
sidebar_position: 1
---
# Link Component
Replace your standard links with the Link component from astro-typesafe-routes for type-safe navigation. Simply import it and use it with route parameters for a seamless experience.

```jsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```
---
sidebar_position: 1
---
# Link Component
Import the Link component and use it as a drop-in replacement for links.

```jsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```
---
sidebar_position: 2
---
# Path Function
If you can't or don't want to use the `Link` component, you can use the `$path` function to ensure safe URLs.

```jsx
---
import { $path } from "astro-typesafe-routes/path";
---

<a href={$path({ to: "/blog/[id]", params: { id: "4" } })}>
  Blog Post
</a>
```
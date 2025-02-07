---
sidebar_position: 0
---
# Path Function
Import the path function and use it as a drop-in replacement on links and anywhere else you would use a URL.

```jsx
---
import { $path } from "astro-typesafe-routes";
---

<a href={$path("/posts/[postId]", { params: { postId: "1" } })}>
  Blog Post
</a>
```
---
sidebar_position: 2
---
# React Link
**Added in:** `astro-typesafe-routes@4.1.0`

The React Link component allows navigation in Astro with React components. Import `Link` from `astro-typesafe-routes/link/react` and specify the route using the `to` prop.

```jsx
import Link from "astro-typesafe-routes/link/react";

export default function Component() {
  return <Link to="/about">About Page</Link>;
}
```
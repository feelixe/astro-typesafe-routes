# Link

## Astro Link

Replace your standard links with the Link component from astro-typesafe-routes for typesafe navigation. Simply import it and use it with route parameters for a seamless experience.

```jsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

<br />

## React Link

**Added in** `4.1.0`

The React Link component allows navigation in Astro with React components. Import `Link` from `astro-typesafe-routes/link/react` and specify the route using the `to` prop.

```jsx
import Link from "astro-typesafe-routes/link/react";

export default function Component() {
  return <Link to="/about">About Page</Link>;
}
```

<br />

## Custom Link Component

Sometimes, you may need to create your own custom `Link` component while still maintaining type safety. To achieve this, you can import the `Route` and `RouteOptions` types, which allow you to add typesafe routing to your custom implementation.

```tsx
---
import type { HTMLAttributes } from "astro/types";
import type { RouteOptions, Route } from "astro-typesafe-routes/path";
import { $path } from "astro-typesafe-routes/path";

export type Props<T extends Route> = Omit<HTMLAttributes<"a">, "href"> &
  RouteOptions<T>;

const {
  to,
  params,
  search,
  searchParams,
  hash,
  trailingSlash,
  ...anchorProps
} = Astro.props;

const href = $path({ to, params, search, searchParams, hash, trailingSlash });
---

<a href={href} {...anchorProps}>
  <slot />
</a>
```

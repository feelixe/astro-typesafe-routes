---
sidebar_position: 4
---
# Custom Link Component
Import Route and RouteOptions types to add type safety to your custom link components:
```tsx
---
import type { HTMLAttributes } from "astro/types";
import type { RouteOptions, Route } from "astro-typesafe-routes/path";
import { $path } from "astro-typesafe-routes/path";

export type Props<T extends Route> = Omit<HTMLAttributes<"a">, "href"> &
  RouteOptions<T>;

const { to, params, search, hash, trailingSlash, ...anchorProps } = Astro.props;
const href = $path({ to, params, search, hash, trailingSlash });
---

<a href={href} {...anchorProps}>
  <slot />
</a>
```
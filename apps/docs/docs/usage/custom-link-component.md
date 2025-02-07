---
sidebar_position: 4
---
# Custom Link Component
Sometimes, you may need to create your own custom `Link` component while still maintaining type safety. To achieve this, you can import the `Route` and `RouteOptions` types, which allow you to add type-safe routing to your custom implementation.
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
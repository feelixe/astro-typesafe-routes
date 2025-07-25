# Link

## Astro Link

Use the Link component from astro-typesafe-routes to enable type-safe navigation.

```tsx
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

If you need a Link in a React component, use the React Link instead.

<br />

## React Link

The React Link component allows navigation in Astro with React components. Import Link from astro-typesafe-routes/link/react and specify the route using the to prop.

```tsx
import Link from "astro-typesafe-routes/link/react";

export default function Component() {
  return <Link to="/about">About Page</Link>;
}
```

<br />

## Custom Astro Link

todo

<br />

## Custom React Link

If you need to create a React component that accepts a link, add `RouteOptions` to your props like this:

```tsx
import {
  $path,
  type RouteId,
  type RouteOptions,
} from "astro-typesafe-routes/path";
import type { ComponentProps } from "react";

export type CustomReactLinkProps<T extends RouteId> = Omit<
  ComponentProps<"a">,
  "href"
> &
  RouteOptions<T>;

export function CustomReactLink<T extends RouteId>(
  props: CustomReactLinkProps<T>,
) {
  const {
    to,
    params,
    search,
    searchParams,
    hash,
    trailingSlash,
    children,
    ...rest
  } = props;

  const link = {
    to,
    params,
    search,
    searchParams,
    hash,
    trailingSlash,
  } as RouteOptions<T>;

  const href = $path(link);

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
```

<br />

## Optional Fields

The `Link` component supports the optional fields `searchParams`, `hash`, and `trailingSlash`.

Note that `trailingSlash` will be automatically read from `astro.config.js` and only needs to be passed explicitly as an override.

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
  Blog
</Link>
```

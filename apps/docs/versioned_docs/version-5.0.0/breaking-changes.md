---
sidebar_position: 4
---

# Breaking Changes

## Astro 4
Astro version 4 is no longer support.

## Route Type
The type `Route` has been renamed to `RouteId`.
```ts
import { Route } from "astro-typesafe-routes/path";
```
```ts
import { RouteId } from "astro-typesafe-routes/path";
```

## Spread params
Spread params are now passed without the `...` prefix.
```tsx
<Link to="/blog/[...path]" params={{ "...path": "about"}}>
	Blog
</Link>
```
```tsx
<Link to="/blog/[...path]" params={{ path: "about"}}>
	Blog
</Link>
```

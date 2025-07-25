# Path Function

For cases like redirects or when the Link component isn’t suitable, use the `$path` function to get type-safe URLs.

```tsx
---
import { isLoggedIn } from '../utils';
import { $path } from "astro-typesafe-routes/path";

const cookie = Astro.request.headers.get('cookie');

if (!isLoggedIn(cookie)) {
  return Astro.redirect($path({ to: "/login" }));
}
---
```

<br />

## Optional Fields

The `$path` function supports the optional fields `searchParams`, `hash`, and `trailingSlash`.

Note that `trailingSlash` will be automatically read from `astro.config.js` and only needs to be passed explicitly as an override.

```tsx
---
import { $path } from "astro-typesafe-routes/path";

$path({
  to: "/blog",
  hash: "header",
  trailingSlash: true,
  searchParams: { filter: "recent" }
})
---
```

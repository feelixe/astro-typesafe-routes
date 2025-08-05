# Path Function

For cases like redirects or when the `Link` component isn’t suitable, use the `$path` function to get typesafe URLs.

```jsx
---
import { isLoggedIn } from '../utils';
import { $path } from "astro-typesafe-routes/path";

const cookie = Astro.request.headers.get('cookie');

if (!isLoggedIn(cookie)) {
  return Astro.redirect($path({ to: "/login" }));
}
---
```

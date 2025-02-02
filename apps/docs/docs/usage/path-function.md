---
sidebar_position: 2
---
# Path Function
Replace your standard links with the Link component from astro-typesafe-routes for type-safe navigation. Simply import it and use it with route parameters for a seamless experience.

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
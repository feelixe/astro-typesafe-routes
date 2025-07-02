---
sidebar_position: 6
---
# Redirect and Rewrite
Typesafe redirects and rewrite can be created from the route.
```tsx
---
import { createRoute } from "astro-typesafe-routes/route-schema";

export const Route = createRoute({ routeId: "/about" });

return Route.redirect(Astro, { to: "/" });
---
```

```tsx
---
import { createRoute } from "astro-typesafe-routes/route-schema";

export const Route = createRoute({ routeId: "/about" });

return Route.rewrite(Astro, { to: "/" });
---
```

Alternatively with the `$path` function
```tsx
---
import { $path } from "astro-typesafe-routes/path";

return Astro.redirect($path({ to: "/" }));
---
```

---
sidebar_position: 6
---
# Redirect and Rewrite
Typesafe redirects and rewrite can be created from the route.
```tsx
---
import { createRouteSchema } from "astro-typesafe-routes/route-schema";

export const routeSchema = createRouteSchema({ routeId: "/about" });
const route = routeSchema.parse(Astro);

return route.redirect({ to: "/" });
---
```

```tsx
---
import { createRouteSchema } from "astro-typesafe-routes/route-schema";

export const routeSchema = createRouteSchema({ routeId: "/about" });
const route = routeSchema.parse(Astro);

return route.rewrite({ to: "/" });
---
```

Alternatively with the `$path` function
```tsx
---
import { $path } from "astro-typesafe-routes/path";

return Astro.redirect($path({ to: "/" }));
---
```

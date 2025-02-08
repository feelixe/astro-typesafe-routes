---
sidebar_position: 6
---
# Get Params
Use `getParams` to retrieve route parameters in a typesafe way. It returns a typed object based on the route's params. Internally, it simply returns `Astro.params` but ensures proper typing. If you pass the wrong route id, the params value and type will not match.
```tsx
---
import { getParams } from "astro-typesafe-routes/params";

const params = getParams(Astro, "/[id]");
---
```

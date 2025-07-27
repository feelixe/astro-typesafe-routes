# Configuration

## Automatic Route Updates

Astro Typesafe Routes will automatically update the `routeId` of changed routes. If you want to disable this, you can set `disableAutomaticRouteUpdates` in the integration options.

```ts
export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      disableAutomaticRouteUpdates: true,
    }),
  ],
});
```

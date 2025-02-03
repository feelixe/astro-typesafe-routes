---
sidebar_position: 3
---

# Configurations
This integration will automatically detects the running Astro major version for compatibility. If it should detect the wrong version you can pass an override as argument to the integration.
```typescript
export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      astroVersion: 4
    })
  ],
});
```

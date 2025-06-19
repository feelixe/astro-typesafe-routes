import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    astroTypesafeRoutes({
      astroVersion: 4,
    }),
  ],
});

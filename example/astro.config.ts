// @ts-check
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      astroVersion: 5,
    }),
  ],
});

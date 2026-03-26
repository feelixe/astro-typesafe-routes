// @ts-check
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://example.com",
  integrations: [astroTypesafeRoutes(), react()],
});

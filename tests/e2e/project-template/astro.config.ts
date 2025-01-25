// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import astroTypesafeRoutes from "astro-typesafe-routes";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), astroTypesafeRoutes()],
});

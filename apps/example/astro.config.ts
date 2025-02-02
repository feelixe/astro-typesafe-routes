// @ts-check
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [
    astroTypesafeRoutes({
      astroVersion: 4,
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});

// @ts-check
import { defineConfig } from "astro/config";
import astroTypesafeRoutes from "astro-typesafe-routes";
import node from "@astrojs/node";
import vue from "@astrojs/vue";

export default defineConfig({
  integrations: [
    vue(),
    astroTypesafeRoutes({
      astroVersion: 4,
    }),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});

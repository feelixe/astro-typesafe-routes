// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import astroTypesafeRoutes from "astro-typesafe-routes";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), astroTypesafeRoutes()],
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
  },
});

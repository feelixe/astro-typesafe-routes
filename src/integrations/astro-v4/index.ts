import { AstroIntegration } from "astro";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutes } from "./resolve-routes.js";
import * as path from "node:path";

export default function astroTypesafeRoutesAstroV4(): AstroIntegration {
  let declarationUrl: URL | undefined;
  let pagesDir: string | undefined;

  async function generate() {
    if (!pagesDir || !declarationUrl) {
      throw new Error("Unexpected error: pages or declaration was undefined");
    }
    const routes = await resolveRoutes(pagesDir);

    await writeDeclarationFile({
      path: declarationUrl.pathname,
      content: await getDeclarationContent(routes),
    });
  }

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:config:setup": async (args) => {
        args.updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-typesafe-routes",
                configureServer: (server) => {
                  server.watcher.on("add", async () => {
                    await generate();
                    logSuccess(args.logger);
                  });
                  server.watcher.on("unlink", async () => {
                    await generate();
                    logSuccess(args.logger);
                  });
                },
              },
            ],
          },
        });
      },
      "astro:config:done": async (args) => {
        pagesDir = path.join(args.config.root.pathname, "src", "pages");
        const routes = await resolveRoutes(pagesDir);

        declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: await getDeclarationContent(routes),
        });

        logSuccess(args.logger);
      },
    },
  };
}

import { AstroIntegration } from "astro";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutes } from "./resolve-routes.js";
import { fileURLToPath } from "url";

export default function astroTypesafeRoutesAstroV4(): AstroIntegration {
  let declarationUrl: URL | undefined;
  let rootDir: string | undefined;

  async function generate() {
    if (!rootDir || !declarationUrl) {
      throw new Error("Unexpected error: rootDir or declaration was undefined");
    }
    const routes = await resolveRoutes(rootDir);

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
        rootDir = fileURLToPath(args.config.root);
        const routes = await resolveRoutes(rootDir);

        declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: await getDeclarationContent(routes),
        });

        logSuccess(args.logger);
      },
    },
  };
}

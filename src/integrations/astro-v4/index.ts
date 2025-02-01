import { AstroIntegration, AstroIntegrationLogger } from "astro";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutesAstroV4 } from "./resolve-routes.js";
import { fileURLToPath } from "url";

export default function astroTypesafeRoutesAstroV4(): AstroIntegration {
  let declarationPath: string | undefined;
  let rootDir: string | undefined;

  async function generate(logger: AstroIntegrationLogger) {
    if (!rootDir || !declarationPath) {
      throw new Error(
        "Unexpected error: rootDir or declarationPath was undefined"
      );
    }
    const routes = await resolveRoutesAstroV4(rootDir);

    const declarationContent = await getDeclarationContent({
      outPath: declarationPath,
      routes,
    });
    await writeDeclarationFile({
      outPath: declarationPath,
      content: declarationContent,
    });
    logSuccess(logger);
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
                    await generate(args.logger);
                  });
                  server.watcher.on("unlink", async () => {
                    await generate(args.logger);
                  });
                },
              },
            ],
          },
        });
      },
      "astro:config:done": async (args) => {
        rootDir = fileURLToPath(args.config.root);

        const declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: "",
        });
        declarationPath = fileURLToPath(declarationUrl);

        await generate(args.logger);
      },
    },
  };
}

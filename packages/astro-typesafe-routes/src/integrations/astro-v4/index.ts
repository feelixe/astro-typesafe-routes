import type {
  AstroIntegration,
  AstroIntegrationLogger,
  InjectedType,
} from "astro";
import { fileURLToPath } from "node:url";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutesAstroV4 } from "./resolve-routes.js";
import {
  AstroConfigDidNotResolveError,
  NoDeclarationPathError,
} from "../common/errors.js";
import { DECLARATION_FILENAME } from "../common/constants.js";
import type { RequiredAstroConfig } from "../common/types.js";

export function astroTypesafeRoutesAstroV4(): AstroIntegration {
  let declarationPath: string | undefined;
  let astroConfig: RequiredAstroConfig;

  async function generate(
    logger: AstroIntegrationLogger,
    injectFn?: (injectedType: InjectedType) => unknown,
  ) {
    if (!astroConfig) throw new AstroConfigDidNotResolveError();
    if (!declarationPath) {
      throw new NoDeclarationPathError();
    }
    const routes = await resolveRoutesAstroV4(astroConfig);

    const declarationContent = await getDeclarationContent({
      outPath: declarationPath,
      routes,
    });

    if (!injectFn) {
      await writeDeclarationFile({
        filename: declarationPath,
        content: declarationContent,
      });
    } else {
      await injectFn({
        content: declarationContent,
        filename: DECLARATION_FILENAME,
      });
    }

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
        astroConfig = {
          rootDir: fileURLToPath(args.config.root),
          buildOutput: args.buildOutput,
        };

        const declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: "",
        });

        declarationPath = fileURLToPath(declarationUrl);
        await generate(args.logger, args.injectTypes);
      },
    },
  };
}

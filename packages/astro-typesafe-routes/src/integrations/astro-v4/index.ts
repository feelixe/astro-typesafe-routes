import { AstroIntegration, AstroIntegrationLogger, InjectedType } from "astro";
import { fileURLToPath } from "url";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutesAstroV4 } from "./resolve-routes.js";
import {
  AstroRootDirDidNotResolveError,
  NoDeclarationPathError,
} from "../common/errors.js";
import { DECLARATION_FILENAME } from "../common/constants.js";

export function astroTypesafeRoutesAstroV4(): AstroIntegration {
  let declarationPath: string | undefined;
  let rootDir: string | undefined;

  async function generate(
    logger: AstroIntegrationLogger,
    injectFn?: (injectedType: InjectedType) => unknown,
  ) {
    if (!rootDir) throw new AstroRootDirDidNotResolveError();
    if (!declarationPath) {
      throw new NoDeclarationPathError();
    }
    const routes = await resolveRoutesAstroV4(rootDir);

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
        rootDir = fileURLToPath(args.config.root);

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

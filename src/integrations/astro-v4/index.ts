import { AstroIntegration, AstroIntegrationLogger, InjectedType } from "astro";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { resolveRoutesAstroV4 } from "./resolve-routes.js";
import { fileURLToPath } from "url";
import { AstroTypesafeRoutesBaseParams } from "../common/types.js";
import { AstroRootDirDidNotResolveError } from "../common/errors.js";
import { DECLARATION_FILENAME } from "../common/constants.js";

export default function astroTypesafeRoutesAstroV4(
  args?: AstroTypesafeRoutesBaseParams,
): AstroIntegration {
  const typedSearchParams = args?.typedSearchParams ?? false;
  let declarationPath: string | undefined;
  let rootDir: string | undefined;

  async function generate(
    logger: AstroIntegrationLogger,
    injectFn?: (injectedType: InjectedType) => unknown,
  ) {
    if (!rootDir) throw new AstroRootDirDidNotResolveError();
    if (!rootDir || !declarationPath) {
      throw new Error(
        "Unexpected error: rootDir or declarationPath was undefined",
      );
    }
    const routes = await resolveRoutesAstroV4(rootDir);

    const declarationContent = await getDeclarationContent({
      outPath: declarationPath,
      routes,
      typedSearchParams,
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

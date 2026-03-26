import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
  IntegrationResolvedRoute,
} from "astro";
import { fileURLToPath } from "node:url";
import { AstroConfigDidNotResolveError } from "./core/errors.js";
import { getDeclarationContent, logSuccess } from "./core/declaration-file.js";
import { DECLARATION_FILENAME } from "./core/constants.js";
import { getRoutes } from "./core/routes.js";
import { updateRouteId } from "./core/update-route-id.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type AstroTypesafeRoutesParams = {
  disableAutomaticRouteUpdates?: boolean;
};

export default function astroTypesafeRoutes(args?: AstroTypesafeRoutesParams): AstroIntegration {
  let declarationPath: string | undefined;
  let astroConfig: AstroConfig;

  async function generate(logger: AstroIntegrationLogger, routes: IntegrationResolvedRoute[]) {
    if (!declarationPath) return;
    if (!astroConfig) throw new AstroConfigDidNotResolveError();

    const resolvedRoutes = await getRoutes({
      routes,
      astroConfig,
    });

    if (!args?.disableAutomaticRouteUpdates) {
      await Promise.all(resolvedRoutes.map(updateRouteId));
    }

    const declarationContent = await getDeclarationContent({
      routes: resolvedRoutes,
      outPath: declarationPath,
    });

    const directory = path.dirname(declarationPath);

    await mkdir(directory, { recursive: true });
    await writeFile(declarationPath, declarationContent);
    logSuccess(logger);
  }

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:routes:resolved": async (args) => {
        console.info("astro:routes:resolved");

        await generate(args.logger, args.routes);
      },
      "astro:config:done": async (args) => {
        console.info("astro:config:done");
        astroConfig = args.config;
        const declarationUrl = args.injectTypes({
          filename: DECLARATION_FILENAME,
          content: "",
        });
        declarationPath = fileURLToPath(declarationUrl);
      },
      "astro:config:setup": (args) => {
        const trailingSlash = args.config.trailingSlash;

        args.updateConfig({
          vite: {
            define: {
              "import.meta.env.TRAILING_SLASH": JSON.stringify(trailingSlash),
            },
          },
        });
      },
    },
  };
}

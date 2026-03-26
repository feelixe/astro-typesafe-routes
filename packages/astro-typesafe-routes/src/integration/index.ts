import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
  IntegrationResolvedRoute,
} from "astro";
import { fileURLToPath } from "node:url";
import { AstroConfigDidNotResolveError, AstroRoutesDidNotResolveError } from "./core/errors.js";
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
  let routes: IntegrationResolvedRoute[] | undefined;

  async function generate(logger: AstroIntegrationLogger) {
    if (!declarationPath) return;
    if (!astroConfig) throw new AstroConfigDidNotResolveError();
    if (!routes) throw new AstroRoutesDidNotResolveError();

    const resolvedRoutes = await getRoutes({
      routes: routes,
      astroConfig,
    });
    if (!args?.disableAutomaticRouteUpdates) {
      await Promise.all(resolvedRoutes.map((route) => updateRouteId(route)));
    }

    const declarationContent = await getDeclarationContent({
      resolvedRoutes,
      outPath: declarationPath,
      astroConfig,
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
        routes = args.routes;
        await generate(args.logger);
      },
      "astro:config:done": async (args) => {
        astroConfig = args.config;
        const declarationUrl = args.injectTypes({
          filename: DECLARATION_FILENAME,
          content: "",
        });
        declarationPath = fileURLToPath(declarationUrl);
        if (routes) {
          await generate(args.logger);
        }
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

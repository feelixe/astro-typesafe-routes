import type {
  AstroIntegration,
  AstroIntegrationLogger,
  InjectedType,
  IntegrationResolvedRoute,
} from "astro";
import type { RequiredAstroConfig } from "./core/types.js";
import { fileURLToPath } from "node:url";
import { AstroConfigDidNotResolveError, AstroRoutesDidNotResolveError } from "./core/errors.js";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "./core/declaration-file.js";
import { DECLARATION_FILENAME } from "./core/constants.js";
import { getRoutes } from "./core/routes.js";
import { updateRouteId } from "./core/update-route-id.js";

export type AstroTypesafeRoutesParams = {
  disableAutomaticRouteUpdates?: boolean;
};

export default function astroTypesafeRoutes(args?: AstroTypesafeRoutesParams): AstroIntegration {
  let astroRoutes: IntegrationResolvedRoute[] | undefined;
  let declarationPath: string | undefined;
  let astroConfig: RequiredAstroConfig;

  async function generate(
    logger: AstroIntegrationLogger,
    injectFn?: (injectedType: InjectedType) => unknown,
  ) {
    if (!declarationPath) return;
    if (!astroRoutes) throw new AstroRoutesDidNotResolveError();
    if (!astroConfig) throw new AstroConfigDidNotResolveError();

    const resolvedRoutes = await getRoutes({
      routes: astroRoutes,
      astroConfig,
    });

    if (!args?.disableAutomaticRouteUpdates) {
      await Promise.all(resolvedRoutes.map(updateRouteId));
    }

    const declarationContent = await getDeclarationContent({
      routes: resolvedRoutes,
      outPath: declarationPath,
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
      "astro:routes:resolved": async (args) => {
        astroRoutes = args.routes;
        await generate(args.logger);
      },
      "astro:config:done": async (args) => {
        astroConfig = {
          rootDir: fileURLToPath(args.config.root),
          buildOutput: args.buildOutput,
        };

        const declarationUrl = args.injectTypes({
          filename: DECLARATION_FILENAME,
          content: "",
        });

        declarationPath = fileURLToPath(declarationUrl);
        await generate(args.logger, args.injectTypes);
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

import { AstroIntegration, IntegrationResolvedRoute } from "astro";
import { DynamicRoute } from "../common/types.js";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { fileURLToPath } from "url";
import * as path from "node:path";
import { doesRouteHaveSearchSchema } from "../common/search-params.js";

export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
  rootDir: string;
};

export async function getRoutes(
  args: GetRoutesParams
): Promise<DynamicRoute[]> {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal"
  );
  const promises = withoutInternal.map(async (route) => {
    const routeFilePath = path.join(args.rootDir, route.entrypoint);
    const hasSearchSchema = await doesRouteHaveSearchSchema(routeFilePath);

    return {
      path: route.pattern ?? "",
      params: route.params.length > 0 ? route.params : null,
      filePath: routeFilePath,
      hasSearchSchema,
    };
  });

  return await Promise.all(promises);
}

export function astroTypesafeRoutesAstroV5(): AstroIntegration {
  let astroRoutes: IntegrationResolvedRoute[] | undefined;
  let declarationPath: string | undefined;
  let rootDir: string | undefined;

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:routes:resolved": async (args) => {
        astroRoutes = args.routes;
        if (!declarationPath) {
          return;
        }

        if (!rootDir) {
          throw new Error("Unexpected error: rootDir was not resolved");
        }

        const resolvedRoutes = await getRoutes({
          routes: args.routes,
          rootDir,
        });

        await writeDeclarationFile({
          path: declarationPath,
          content: await getDeclarationContent({
            routes: resolvedRoutes,
            outPath: declarationPath,
          }),
        });

        logSuccess(args.logger);
      },
      "astro:config:done": async (args) => {
        rootDir = fileURLToPath(args.config.root);

        if (!astroRoutes) {
          throw new Error("Unexpected error: Astro routes did not resolve");
        }

        let routes = await getRoutes({ routes: astroRoutes, rootDir });

        const declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: "",
        });

        declarationPath = fileURLToPath(declarationUrl);

        args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: await getDeclarationContent({
            routes,
            outPath: declarationPath,
          }),
        });

        logSuccess(args.logger);
      },
    },
  };
}

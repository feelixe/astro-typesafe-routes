import { AstroIntegration, IntegrationResolvedRoute } from "astro";
import { DynamicRoute } from "../../types";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common";
export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
};

export function getRoutes(args: GetRoutesParams): DynamicRoute[] {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal"
  );
  return withoutInternal.map((route) => ({
    path: route.pattern ?? "",
    params: route.params.length > 0 ? route.params : null,
  }));
}

export function astroTypesafeRoutesAstroV5(): AstroIntegration {
  let astroRoutes: IntegrationResolvedRoute[] | undefined;
  let declarationUrl: URL | undefined;

  return {
    name: "astro-typesafe-routes",
    hooks: {
      "astro:routes:resolved": async (args) => {
        if (!declarationUrl) {
          return;
        }

        const resolvedRoutes = await getRoutes(args);

        await writeDeclarationFile({
          path: declarationUrl.pathname,
          content: await getDeclarationContent(resolvedRoutes),
        });

        logSuccess(args.logger);
      },
      "astro:config:done": async (args) => {
        if (!astroRoutes) {
          throw new Error("Unexpected error: Astro routes did not resolve");
        }

        let routes = getRoutes({ routes: astroRoutes });

        declarationUrl = args.injectTypes({
          filename: "astro-typesafe-routes.d.ts",
          content: await getDeclarationContent(routes),
        });

        logSuccess(args.logger);
      },
    },
  };
}

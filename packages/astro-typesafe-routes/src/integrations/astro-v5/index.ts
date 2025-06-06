import type {
  AstroIntegration,
  AstroIntegrationLogger,
  InjectedType,
  IntegrationResolvedRoute,
  RoutePart,
} from "astro";
import type { RequiredAstroConfig, ResolvedRoute } from "../common/types.js";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import { doesRouteHaveSearchSchema } from "../common/search-params.js";
import {
  AstroConfigDidNotResolveError,
  AstroRoutesDidNotResolveError,
} from "../common/errors.js";
import { DECLARATION_FILENAME } from "../common/constants.js";

function segmentsToPath(segments: RoutePart[][]) {
  const routeParts = segments.map((segment) => {
    return segment
      .map((part) => {
        if (part.dynamic) {
          return `[${part.content}]`;
        }
        return part.content;
      })
      .join("");
  });

  return `/${routeParts.join("/")}`;
}

export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
  astroConfig: RequiredAstroConfig;
};

export async function getRoutes(
  args: GetRoutesParams,
): Promise<ResolvedRoute[]> {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal" && route.type !== "redirect",
  );
  const promises = withoutInternal.map(async (route) => {
    const absolutePath = path.join(args.astroConfig.rootDir, route.entrypoint);

    // Search params have no effect on static builds.
    const shouldResolveSearchParams = args.astroConfig.buildOutput === "server";
    const hasSearchSchema = shouldResolveSearchParams
      ? await doesRouteHaveSearchSchema(absolutePath)
      : false;

    const params = route.segments
      .flatMap((segment) =>
        // Only include dynamic segments (params)
        segment.filter((routePart) => routePart.dynamic),
      )
      .map((routePart) =>
        // Remove the ellipsis if it's a spread param
        routePart.spread ? routePart.content.slice(3) : routePart.content,
      );

    const routePath = segmentsToPath(route.segments);

    return {
      path: routePath,
      params: params.length > 0 ? params : null,
      absolutePath,
      hasSearchSchema,
    };
  });

  return await Promise.all(promises);
}

export function astroTypesafeRoutesAstroV5(): AstroIntegration {
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
    },
  };
}

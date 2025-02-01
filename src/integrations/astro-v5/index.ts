import {
  AstroIntegration,
  AstroIntegrationLogger,
  InjectedType,
  IntegrationResolvedRoute,
} from "astro";
import {
  AstroTypesafeRoutesBaseParams,
  ResolvedRoute,
} from "../common/types.js";
import {
  getDeclarationContent,
  logSuccess,
  writeDeclarationFile,
} from "../common/index.js";
import { fileURLToPath } from "url";
import * as path from "node:path";
import { doesRouteHaveSearchSchema } from "../common/search-params.js";
import {
  AstroRootDirDidNotResolveError,
  AstroRoutesDidNotResolveError,
} from "../common/errors.js";
import { DECLARATION_FILENAME } from "../common/constants.js";

export type GetRoutesParams = {
  routes: IntegrationResolvedRoute[];
  rootDir: string;
};

export async function getRoutes(
  args: GetRoutesParams,
): Promise<ResolvedRoute[]> {
  const withoutInternal = args.routes.filter(
    (route) => route.origin !== "internal",
  );
  const promises = withoutInternal.map(async (route) => {
    const absolutePath = path.join(args.rootDir, route.entrypoint);
    const hasSearchSchema = await doesRouteHaveSearchSchema(absolutePath);

    return {
      path: route.pattern ?? "",
      params: route.params.length > 0 ? route.params : null,
      absolutePath,
      hasSearchSchema,
    };
  });

  return await Promise.all(promises);
}

export function astroTypesafeRoutesAstroV5(
  args?: AstroTypesafeRoutesBaseParams,
): AstroIntegration {
  const typedSearchParams = args?.typedSearchParams ?? false;
  let astroRoutes: IntegrationResolvedRoute[] | undefined;
  let declarationPath: string | undefined;
  let rootDir: string | undefined;

  async function generate(
    logger: AstroIntegrationLogger,
    injectFn?: (injectedType: InjectedType) => unknown,
  ) {
    if (!declarationPath) return;
    if (!astroRoutes) throw new AstroRoutesDidNotResolveError();
    if (!rootDir) throw new AstroRootDirDidNotResolveError();

    const resolvedRoutes = await getRoutes({
      routes: astroRoutes,
      rootDir,
    });

    const declarationContent = await getDeclarationContent({
      routes: resolvedRoutes,
      outPath: declarationPath,
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
      "astro:routes:resolved": async (args) => {
        astroRoutes = args.routes;
        await generate(args.logger);
      },
      "astro:config:done": async (args) => {
        rootDir = fileURLToPath(args.config.root);

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

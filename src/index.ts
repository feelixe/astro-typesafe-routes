import { AstroIntegration } from "astro";
import {
  assertSupportedVersion,
  getAstroMajorVersion,
} from "./astro-version.js";
import { astroTypesafeRoutesAstroV5 } from "./integrations/astro-v5/index.js";
import astroTypesafeRoutesAstroV4 from "./integrations/astro-v4/index.js";

export * from "./path.js";

export type AstroTypesafeRoutesParams = {
  astroVersion?: 4 | 5;
  skipVersionCheck?: boolean;
};

export default function astroTypesafeRoutes(
  args?: AstroTypesafeRoutesParams,
): AstroIntegration {
  if (!args?.skipVersionCheck) {
    assertSupportedVersion();
  }

  const astroMajorVersion = args?.astroVersion ?? getAstroMajorVersion();

  if (astroMajorVersion === 5) {
    return astroTypesafeRoutesAstroV5();
  }
  if (astroMajorVersion === 4) {
    return astroTypesafeRoutesAstroV4();
  }

  throw new Error(
    `astro-typesafe-routes is not compatible with this Astro version ${astroMajorVersion}`,
  );
}

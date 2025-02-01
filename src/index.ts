import { AstroIntegration } from "astro";
import {
  assertSupportedVersion,
  getAstroMajorVersion,
} from "./astro-version.js";
import { astroTypesafeRoutesAstroV5 } from "./integrations/astro-v5/index.js";
import astroTypesafeRoutesAstroV4 from "./integrations/astro-v4/index.js";
import { AstroTypesafeRoutesBaseParams } from "./integrations/common/types.js";

export type AstroTypesafeRoutesParams = AstroTypesafeRoutesBaseParams & {
  astroVersion?: 4 | 5;
};

export default function astroTypesafeRoutes(
  args?: AstroTypesafeRoutesParams,
): AstroIntegration {
  if (args?.astroVersion === undefined) {
    assertSupportedVersion();
  }

  const astroMajorVersion = args?.astroVersion ?? getAstroMajorVersion();

  if (astroMajorVersion === 5) {
    return astroTypesafeRoutesAstroV5(args);
  }
  if (astroMajorVersion === 4) {
    return astroTypesafeRoutesAstroV4(args);
  }

  throw new Error(
    `astro-typesafe-routes is not compatible with this Astro version ${astroMajorVersion}`,
  );
}

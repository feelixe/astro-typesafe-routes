import { AstroIntegration } from "astro";
import {
  assertSupportedVersion,
  getAstroMajorVersion,
} from "./astro-version.js";
import { astroTypesafeRoutesAstroV5 } from "./integrations/astro-v5/index.js";
import astroTypesafeRoutesAstroV4 from "./integrations/astro-v4/index.js";

export * from "./path.js";

export default function astroTypesafeRoutes(): AstroIntegration {
  assertSupportedVersion();
  const astroMajorVersion = getAstroMajorVersion();

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

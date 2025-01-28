import { AstroIntegration } from "astro";
import { assertSupportedVersion, getAstroMajorVersion } from "astro-version";
import { astroTypesafeRoutesAstroV5 } from "integrations/astro-v5";
import astroTypesafeRoutesAstroV4 from "integrations/astro-v4";

export * from "./path";

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

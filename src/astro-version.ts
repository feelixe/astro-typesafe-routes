import { createRequire } from "node:module";
import semver from "semver";
import * as fs from "fs";

const SUPPORTED_VERSIONS = ">=4.14.0 <6.0.0";

function getAstroVersion() {
  const require = createRequire(import.meta.url);
  const astroPkgPath = require.resolve("astro/package.json");
  const astroPkg = JSON.parse(fs.readFileSync(astroPkgPath, "utf-8"));
  return astroPkg.version as string;
}

export function getAstroMajorVersion() {
  return semver.major(getAstroVersion());
}

export function assertSupportedVersion() {
  const astroVersion = getAstroVersion();

  const isSupportedVersion = semver.satisfies(astroVersion, SUPPORTED_VERSIONS);
  if (!isSupportedVersion) {
    throw new Error(
      `astro-typesafe-routes is not compatible with this Astro version ${astroVersion}, compatible versions are ${SUPPORTED_VERSIONS}`
    );
  }
}

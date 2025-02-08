import semver from "semver";
import packageJson from "astro/package.json" with { type: "json" };

const SUPPORTED_VERSIONS = ">=4.14.0 <6.0.0";

function getAstroVersion() {
  return packageJson.version;
}

export function getAstroMajorVersion() {
  const version = getAstroVersion();
  return semver.major(version);
}

export function assertSupportedVersion() {
  const astroVersion = getAstroVersion();

  const isSupportedVersion = semver.satisfies(astroVersion, SUPPORTED_VERSIONS);
  if (!isSupportedVersion) {
    throw new Error(
      `astro-typesafe-routes is not compatible with this Astro version ${astroVersion}, compatible versions are ${SUPPORTED_VERSIONS}`,
    );
  }
}

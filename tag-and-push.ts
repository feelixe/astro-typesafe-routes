import packageJson from "./package.json";
import semver from "semver";
import { $ } from "bun";

const version = semver.valid(packageJson.version);

if (version === null) {
  throw new Error("Invalid version");
}

await $`git tag -a v${version} -m "Release version ${version}"`;
await $`git push origin v${version}`;

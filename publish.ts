import packageJson from "./package.json";
import semver from "semver";
import { $ } from "bun";
import prompts from "prompts";

const TAG_MAP = [[/^rc[0-9]+$/, "next"] as const];
const DEFAULT_TAG = "latest";

async function publishToNpm(tag: string) {
  await $`bun publish --tag ${tag}`;
}

async function tagAndPush(version: string) {
  await $`git tag -a v${version} -m "Release version ${version}"`;
  await $`git push origin v${version}`;
}

async function getVersionAndTag(version: string) {
  const parsedVersion = semver.valid(version);
  if (parsedVersion === null) {
    throw new Error(`Invalid version: ${version}`);
  }
  const tag = version.split("-").at(-1);
  if (tag === undefined) {
    return { version: parsedVersion, tag: DEFAULT_TAG };
  }
  const matching = TAG_MAP.find(([regex]) => regex.test(tag));
  if (matching === undefined) {
    throw new Error(`Invalid tag: ${tag}`);
  }
  return { version: parsedVersion, tag: matching[1] };
}

const { version, tag } = await getVersionAndTag(packageJson.version);

const res = await prompts({
  type: "confirm",
  name: "value",
  message: `Publish ${packageJson.name} version: ${version} under tag: ${tag}?`,
  initial: false,
});

const userConfirmed = res.value as boolean;

if (!userConfirmed) {
  process.exit(1);
}

await tagAndPush(version);
await publishToNpm(tag);

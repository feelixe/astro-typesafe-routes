import { $ } from "bun";
import { rm } from "node:fs/promises";
import * as path from "node:path";
import { expect, it } from "bun:test";

const LOCAL_DIRECTORIES = ["dist", ".astro"];

async function cleanUpLocalFiles(directory: string) {
  for (const localDirectory of LOCAL_DIRECTORIES) {
    const dir = path.join(directory, localDirectory);
    await rm(dir, { recursive: true, force: true });
  }
}

export type SetupTestProjectArgs = {
  projectDir: string;
};

export async function setupTestProject(args: SetupTestProjectArgs) {
  await cleanUpLocalFiles(args.projectDir);
  await $`bun install`.cwd(args.projectDir);
}

export type BuildPackageParams = {
  dir: string;
};

export async function buildPackage(args: BuildPackageParams) {
  await $`bun run build`.cwd(args.dir);
}

export type CleanUpTestProjectArgs = {
  projectDir: string;
};

export async function cleanUpTestProject(args: CleanUpTestProjectArgs) {
  await cleanUpLocalFiles(args.projectDir);
}

export function expectBuildSuccess(directory: string) {
  it("builds without error", async () => {
    const shellOutput = await $`bun run build`.cwd(directory);
    expect(shellOutput.exitCode).toBe(0);
  }, 60_000);
}

export function expectBuildFailure(directory: string) {
  it("builds with error", async () => {
    const result = await $`bun run build`.cwd(directory).nothrow();
    expect(result.exitCode).not.toBe(0);
  }, 60_000);
}

const versionOutputRegex = /v(\d+\.\d+\.\d+)/;

export type AssertAstroVersionArgs = {
  projectDir: string;
  range: string;
};

export async function assertAstroVersion(args: AssertAstroVersionArgs) {
  const output = await $`bunx astro --version`.cwd(args.projectDir).text();
  const match = output.match(versionOutputRegex);
  if (!match) {
    throw new Error(`Unable to parse Astro version from output: ${output}`);
  }
  const version = match[1];
  if (!Bun.semver.satisfies(version, args.range)) {
    throw new Error(`Expected Astro version matching "${args.range}", but found ${version}`);
  }
}

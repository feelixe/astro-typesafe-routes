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
    await expect(async () => {
      await $`bun run build`.cwd(directory);
    }).toThrow();
  }, 60_000);
}

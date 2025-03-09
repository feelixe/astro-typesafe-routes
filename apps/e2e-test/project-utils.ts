import { $ } from "bun";
import { rm } from "node:fs/promises";
import * as path from "node:path";

const LOCAL_DIRECTORIES = ["dist", ".astro"];

async function cleanUpLocalFiles(ourDir: string) {
  for (const localDirectory of LOCAL_DIRECTORIES) {
    const dir = path.join(ourDir, localDirectory);
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

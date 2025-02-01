import { $ } from "bun";
import { cp, rm } from "node:fs/promises";
import * as path from "node:path";

const LOCAL_DIRECTORIES = ["dist", ".astro", "node_modules"];

async function cleanUpLocalFiles(ourDir: string) {
  for (const localDirectory of LOCAL_DIRECTORIES) {
    const dir = path.join(ourDir, localDirectory);
    await rm(dir, { recursive: true, force: true });
  }
}

export type SetupTestProjectArgs = {
  templateDir: string;
  outDir: string;
  packageDir: string;
};

export async function setupTestProject(args: SetupTestProjectArgs) {
  // Remove any old copy
  await cleanUpTestProject({
    dir: args.outDir,
  });

  // Copy template
  await cp(args.templateDir, args.outDir, { recursive: true });

  // Clean up local files like node_modules
  await cleanUpLocalFiles(args.outDir);

  // Install test-project dependencies
  await $`bun install`.cwd(args.outDir);

  // Build package
  await $`bun run build`.cwd(args.packageDir);

  // Add bun link to package
  await $`bun link`.cwd(args.packageDir);

  // Install bun linked package
  await $`bun link astro-typesafe-routes --save`.cwd(args.outDir);
}

export type CleanUpTestProjectArgs = {
  dir: string;
};

export async function cleanUpTestProject(args: CleanUpTestProjectArgs) {
  await rm(args.dir, { recursive: true, force: true });
}

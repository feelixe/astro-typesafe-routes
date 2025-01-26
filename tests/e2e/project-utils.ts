import { $ } from "bun";
import { cp, rm } from "node:fs/promises";

export type SetupTestProjectArgs = {
  templateDir: string;
  outDir: string;
  packageDir: string;
};

export async function setupTestProject(args: SetupTestProjectArgs) {
  // Copy template
  await cp(args.templateDir, args.outDir, { recursive: true });

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
  await rm(args.dir, { recursive: true });
}

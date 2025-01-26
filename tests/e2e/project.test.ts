import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { $ } from "bun";
import { cp, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = import.meta.dir;

type SetupTestProjectArgs = {
  templateDir: string;
  outDir: string;
  packageDir: string;
};

async function setupTestProject(args: SetupTestProjectArgs) {
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

type CleanUpTestProjectArgs = {
  dir: string;
};

async function cleanUpTestProject(args: CleanUpTestProjectArgs) {
  await $`rm -rf ${args.dir}`;
}

const setups = [
  {
    name: "Astro v4",
    templateDir: path.join(rootDir, "./project-templates/astro-v4"),
    outDir: path.join(rootDir, "./project-astro-v4"),
  },
  {
    name: "Astro v5",
    templateDir: path.join(rootDir, "./project-templates/astro-v5"),
    outDir: path.join(rootDir, "./project-astro-v5"),
  },
];

describe.each(setups)("$name", (args) => {
  const packageDir = path.join(rootDir, "../../");

  beforeEach(async () => {
    await setupTestProject({
      outDir: args.outDir,
      templateDir: args.templateDir,
      packageDir,
    });
  });

  afterEach(async () => {
    await cleanUpTestProject({
      dir: args.outDir,
    });
  });

  it("build fails when project contains an invalid link", async () => {
    await expect(async () => {
      await $`bun run build`.cwd(args.outDir);
    }).toThrow();
  }, 20_000);

  it("build succeeds when project contains only valid links", async () => {
    const invalidPage = path.join(
      args.outDir,
      "./src/pages/page-with-invalid-link.astro",
    );
    await rm(invalidPage);

    await $`bun run build`.cwd(args.outDir);
  }, 20_000);
});

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { $ } from "bun";
import { rm } from "node:fs/promises";
import path from "node:path";
import { cleanUpTestProject, setupTestProject } from "./project-utils";

const rootDir = import.meta.dir;
const packageDir = path.join(rootDir, "../../");

const setups = [
  // {
  //   name: "Astro v4",
  //   templateDir: path.join(rootDir, "./project-templates/astro-v4"),
  //   outDir: path.join(rootDir, "./projects/project-astro-v4"),
  // },
  {
    name: "Astro v5",
    templateDir: path.join(rootDir, "./project-templates/astro-v5"),
    outDir: path.join(rootDir, "./projects/project-astro-v5"),
  },
];

describe.each(setups)("$name", (args) => {
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

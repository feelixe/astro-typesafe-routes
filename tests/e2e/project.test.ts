import { describe, beforeAll, it, afterAll, expect } from "bun:test";
import { $ } from "bun";
import { cp } from "node:fs/promises";
import path from "node:path";

const rootDir = import.meta.dir;

describe("setup", async () => {
  beforeAll(async () => {
    // Copy Astro template project
    const templateDir = path.join(rootDir, "project-template");
    const projectDir = path.join(rootDir, "project");
    await cp(templateDir, projectDir, { recursive: true });

    // Install test-project dependencies
    await $`cd ./project && bun install`.cwd(rootDir);

    // Build package
    await $`cd ../../ && bun run build`.cwd(rootDir);

    // Add bun link to package
    await $`cd ../../ && pwd && bun link`.cwd(rootDir);

    // Install bun linked package
    await $`cd ./project && bun link astro-typesafe-routes --save`.cwd(rootDir);
  });

  it("build fails when project contains an invalid link", async () => {
    await expect(async () => {
      await $`cd ./project && bun run build`.cwd(rootDir);
    }).toThrow();
  }, 20_000);

  it("build succeeds when project contains only valid links", async () => {
    await $`cd ./project && rm ./src/pages/page-with-invalid-link.astro`.cwd(
      rootDir,
    );

    await $`cd ./project && bun run build`.cwd(rootDir);
  }, 20_000);

  afterAll(async () => {
    await $`rm -rf ./project`.cwd(rootDir);
  });
});

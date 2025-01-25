import { describe, beforeAll, it, afterAll, expect } from "bun:test";
import { $ } from "bun";

const rootDir = import.meta.dir;

describe("setup", async () => {
  beforeAll(async () => {
    // Copy Astro template project
    await $`cd ${rootDir} && cp -r ./project-template ./project`;

    // Install test-project dependencies
    await $`cd ${rootDir} && cd ./project && bun install`;

    // Build package
    await $`cd ${rootDir} && cd ../../ && bun run build`;

    // Add bun link to package
    await $`cd ${rootDir} && cd ../../ && pwd && bun link`;

    // Install bun linked package
    await $`cd ${rootDir} && cd ./project && bun link astro-typesafe-routes --save`;
  });

  it("build fails when project contains an invalid link", async () => {
    await expect(async () => {
      await $`cd ${rootDir} && cd ./project && bun run build`;
    }).toThrow();
  }, 20_000);

  it("build succeeds when project contains only valid links", async () => {
    await $`cd ${rootDir} && cd ./project && rm ./src/pages/page-with-invalid-link.astro`;

    await $`cd ${rootDir} && cd ./project && bun run build`;
  }, 20_000);

  afterAll(async () => {
    await $`cd ${rootDir} && rm -rf ./project`;
  });
});

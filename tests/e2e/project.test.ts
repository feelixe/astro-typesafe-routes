import { describe, beforeAll, it, afterAll } from "bun:test";
import { $ } from "bun";

describe("setup", async () => {
  beforeAll(async () => {
    // Copy Astro template project
    await $`cp -r ./project-template ./project`;

    // Install test-project dependencies
    await $`cd ./project && bun install`;

    // Build package
    await $`cd ../../ && bun run build`;

    // Add bun link to package
    await $`cd ../../ && pwd && bun link`;

    // Install bun linked package
    await $`cd ./project && bun link astro-typesafe-routes --save`;

    // it("generates a declaration files");
  });

  it("builds without errors", async () => {
    // Build test project
    await $`cd ./project && bun run build`;
  });

  // afterAll(async () => {
  //   await $`rm -rf ./project`;
  // });
});

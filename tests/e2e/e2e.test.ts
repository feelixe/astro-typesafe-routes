import { describe, beforeAll, afterAll } from "bun:test";
import { $ } from "bun";

describe("setup", async () => {
  beforeAll(async () => {
    // Copy Astro template project
    await $`cp -r ./project-template ./project`;

    // Install dependencies
    await $`cd ./project && bun install`;

    // Build package
    await $`cd ../../ && bun run build`;

    // Add bun link to package
    await $`cd ../../ && pwd && bun link`;

    // Install bunk linked package
    await $`cd ./project && bun link astro-typesafe-routes --save`;

    // console.log(hej);
  });

  afterAll(async () => {
    await $`rm -rf ./project`;
  });
});

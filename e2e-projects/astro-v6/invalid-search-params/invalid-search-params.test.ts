import { beforeAll, describe } from "bun:test";
import { expectBuildFailure, setupTestProject } from "../../utils.ts";

describe("e2e - astro v6 - invalid search params", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
  });

  expectBuildFailure(import.meta.dir);
});

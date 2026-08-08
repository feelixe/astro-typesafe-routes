import { beforeAll, describe } from "bun:test";
import { assertAstroVersion, expectBuildFailure, setupTestProject } from "../../utils.ts";

describe("e2e - astro v7 - invalid search params", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
    await assertAstroVersion({
      projectDir: import.meta.dir,
      range: "^7.0.0",
    });
  });

  expectBuildFailure(import.meta.dir);
});

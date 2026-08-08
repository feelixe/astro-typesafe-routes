import { beforeAll, describe } from "bun:test";
import { assertAstroVersion, expectBuildFailure, setupTestProject } from "../../utils.ts";

describe("e2e - astro v5 - invalid search params", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
    await assertAstroVersion({
      projectDir: import.meta.dir,
      range: "^5.0.0",
    });
  });

  expectBuildFailure(import.meta.dir);
});

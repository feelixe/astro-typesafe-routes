import { beforeAll, describe } from "bun:test";
import { assertAstroVersion, expectBuildSuccess, setupTestProject } from "../../utils.ts";

describe("e2e - astro v7 - valid path", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
    await assertAstroVersion({
      projectDir: import.meta.dir,
      range: "^7.0.0",
    });
  });

  expectBuildSuccess(import.meta.dir);
});

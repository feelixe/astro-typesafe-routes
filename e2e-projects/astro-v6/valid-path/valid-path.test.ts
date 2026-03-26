import { beforeAll, describe } from "bun:test";
import { expectBuildSuccess, setupTestProject } from "../../utils.ts";

describe("e2e - astro v6 - valid path", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
  });

  expectBuildSuccess(import.meta.dir);
});

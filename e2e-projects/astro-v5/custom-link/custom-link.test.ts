import { beforeAll, describe } from "bun:test";
import { expectBuildSuccess, setupTestProject } from "../../utils.ts";

describe("e2e - astro v5 - custom link", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
  });

  expectBuildSuccess(import.meta.dir);
});

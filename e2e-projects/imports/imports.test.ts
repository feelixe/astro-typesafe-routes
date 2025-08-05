import { beforeAll, describe } from "bun:test";
import { expectBuildSuccess, setupTestProject } from "../utils.ts";

describe("e2e - imports", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
  });

  expectBuildSuccess(import.meta.dir);
});

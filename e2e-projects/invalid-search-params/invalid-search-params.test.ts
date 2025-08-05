import { beforeAll, describe } from "bun:test";
import { expectBuildFailure, setupTestProject } from "../utils.ts";

describe("e2e - invalid search params", async () => {
  beforeAll(async () => {
    await setupTestProject({
      projectDir: import.meta.dir,
    });
  });

  expectBuildFailure(import.meta.dir);
});

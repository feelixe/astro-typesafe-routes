import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { $ } from "bun";
import * as path from "node:path";
import {
  buildPackage,
  cleanUpTestProject,
  setupTestProject,
} from "./project-utils.ts";

const ROOT_DIR = import.meta.dir;
const PACKAGE_DIR = path.join(ROOT_DIR, "../../");

beforeAll(async () => {
  await buildPackage({ packageDir: PACKAGE_DIR });
});

const setups = [
  {
    name: "Astro v4 - valid path",
    projectDir: path.join(ROOT_DIR, "../../../../e2e-projects/v4-valid-path"),
    expectBuildSuccess: true,
  },
];

describe.each(setups)("E2E - $name", async (setup) => {
  await beforeAll(async () => {
    await setupTestProject({
      projectDir: setup.projectDir,
    });
  });

  await afterAll(async () => {
    await cleanUpTestProject({
      projectDir: setup.projectDir,
    });
  });

  if (setup.expectBuildSuccess) {
    it("builds without errors", async () => {
      await $`bun run build`.cwd(setup.projectDir);
    }, 60_000);
  } else {
    it("build fails", async () => {
      await expect(async () => {
        await $`bun run build`.cwd(setup.projectDir);
      }).toThrow();
    }, 60_000);
  }
});

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { $ } from "bun";
import * as path from "node:path";
import { buildPackage, cleanUpTestProject, setupTestProject } from "./project-utils.ts";

const E2E_PROJECTS_DIR = path.join(import.meta.dir, "../../e2e-projects");
const WORKSPACE_DIR = path.join(import.meta.dir, "../../");

await beforeAll(async () => {
  await buildPackage({ dir: WORKSPACE_DIR });
});

const setups = [
  {
    name: "Imports",
    projectDir: path.join(E2E_PROJECTS_DIR, "./imports"),
    expectBuildSuccess: true,
  },
  {
    name: "Valid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./valid-path"),
    expectBuildSuccess: true,
  },
  {
    name: "Invalid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./invalid-path"),
    expectBuildSuccess: false,
  },
  {
    name: "Valid search params",
    projectDir: path.join(E2E_PROJECTS_DIR, "./valid-search-params"),
    expectBuildSuccess: true,
  },
  {
    name: "Invalid search params",
    projectDir: path.join(E2E_PROJECTS_DIR, "./invalid-search-params"),
    expectBuildSuccess: false,
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

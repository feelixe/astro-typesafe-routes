import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { $ } from "bun";
import * as path from "node:path";
import {
  buildPackage,
  cleanUpTestProject,
  setupTestProject,
} from "./project-utils.ts";

const E2E_PROJECTS_DIR = path.join(import.meta.dir, "../../e2e-projects");
const WORKSPACE_DIR = path.join(import.meta.dir, "../../");

await beforeAll(async () => {
  await buildPackage({ dir: WORKSPACE_DIR });
});

const setups = [
  {
    name: "Astro v4 - valid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v4-valid-path"),
    expectBuildSuccess: true,
  },
  {
    name: "Astro v4 - invalid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v4-invalid-path"),
    expectBuildSuccess: false,
  },
  {
    name: "Astro v5 - valid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v5-valid-path"),
    expectBuildSuccess: true,
  },
  {
    name: "Astro v5 - invalid path",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v5-invalid-path"),
    expectBuildSuccess: false,
  },
  {
    name: "Astro v5 - valid search params",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v5-valid-search-params"),
    expectBuildSuccess: true,
  },
  {
    name: "Astro v5 - invalid search params",
    projectDir: path.join(E2E_PROJECTS_DIR, "./v5-invalid-search-params"),
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

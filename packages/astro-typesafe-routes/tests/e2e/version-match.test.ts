import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import {
  buildPackage,
  cleanUpTestProject,
  setupTestProject,
} from "./project-utils.ts";
import * as path from "node:path";
import { $ } from "bun";
import * as fs from "node:fs/promises";

const ROOT_DIR = import.meta.dir;
const E2E_PROJECTS_DIR = path.join(ROOT_DIR, "../../../../e2e-projects");
const PACKAGE_DIR = path.join(ROOT_DIR, "../../");

const v4Dir = path.join(E2E_PROJECTS_DIR, "./v4-version-match");
const v5Dir = path.join(E2E_PROJECTS_DIR, "./v5-version-match");

await beforeAll(async () => {
  await buildPackage({ packageDir: PACKAGE_DIR });
});

const declarationPath =
  ".astro/integrations/astro-typesafe-routes/astro-typesafe-routes.d.ts";

describe("version match", async () => {
  await beforeAll(async () => {
    await setupTestProject({
      projectDir: v4Dir,
    });
    await setupTestProject({
      projectDir: v5Dir,
    });

    await $`bun run build`.cwd(v4Dir);
    await $`bun run build`.cwd(v5Dir);
  });

  await afterAll(async () => {
    await cleanUpTestProject({
      projectDir: v4Dir,
    });
    await cleanUpTestProject({
      projectDir: v5Dir,
    });
  });

  it("generated type declarations are the same between astro versions", async () => {
    const v4Declaration = await fs.readFile(
      path.join(v4Dir, declarationPath),
      "utf-8",
    );
    const v5Declaration = await fs.readFile(
      path.join(v5Dir, declarationPath),
      "utf-8",
    );

    expect(v4Declaration).toBe(v5Declaration);
  });
});

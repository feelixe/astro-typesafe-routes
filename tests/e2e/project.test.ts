import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { $ } from "bun";
import path from "node:path";
import { cleanUpTestProject, setupTestProject } from "./project-utils";

const rootDir = import.meta.dir;
const packageDir = path.join(rootDir, "../../");

const setups = [
  {
    name: "Astro v4 - valid path",
    templateDir: path.join(rootDir, "./project-templates/v4-valid-path"),
    expectBuildSuccess: false,
  },
  {
    name: "Astro v4 - invalid path",
    templateDir: path.join(rootDir, "./project-templates/v4-invalid-path"),
    expectBuildSuccess: false,
  },
];

for (const setup of setups) {
  describe(setup.name, async () => {
    const outDir = setup.templateDir.split(path.sep).at(-1);

    if (!outDir) {
      throw new Error("Expected outDir to be defined");
    }

    await beforeAll(async () => {
      await setupTestProject({
        outDir,
        templateDir: setup.templateDir,
        packageDir,
      });
    });

    await afterAll(async () => {
      await cleanUpTestProject({
        dir: outDir,
      });
    });

    if (setup.expectBuildSuccess) {
      it("build without errors when project contains only valid links", async () => {
        await $`bun run build`.cwd(outDir);
      }, 20_000);
    } else {
      it("build fails when project contains an invalid link", async () => {
        await expect(async () => {
          await $`bun run build`.cwd(outDir);
        }).toThrow();
      }, 20_000);
    }
  });
}

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "bun:test";
import { $ } from "bun";
import { rm } from "node:fs/promises";
import path from "node:path";
import { cleanUpTestProject, setupTestProject } from "./project-utils";

const rootDir = import.meta.dir;
const packageDir = path.join(rootDir, "../../");

const setups = [
  // {
  //   name: "Astro v4 - valid path",
  //   templateDir: path.join(rootDir, "./project-templates/v4/valid-path"),
  //   outDir: path.join(rootDir, "./projects/v4-valid-path"),
  // },
  {
    name: "Astro v4 - invalid path",
    templateDir: path.join(rootDir, "./project-templates/v4/invalid-path"),
    outDir: path.join(rootDir, "./projects/v4-invalid-path"),
  },
  {
    name: "Astro v5 - valid path",
    templateDir: path.join(rootDir, "./project-templates/v5/valid-path"),
    outDir: path.join(rootDir, "./projects/v5-valid-path"),
  },
  {
    name: "Astro v5 - invalid path",
    templateDir: path.join(rootDir, "./project-templates/v5/invalid-path"),
    outDir: path.join(rootDir, "./projects/v5-invalid-path"),
  },
];

describe("Astro v4 - invalid path", () => {
  const outDir = path.join(rootDir, "./projects/v4-invalid-path");
  const templateDir = path.join(rootDir, "./project-templates/v4/invalid-path");

  beforeAll(async () => {
    await setupTestProject({
      outDir,
      templateDir,
      packageDir,
    });
  });

  afterAll(async () => {
    await cleanUpTestProject({
      dir: outDir,
    });
  });

  it("build fails when project contains an invalid link", async () => {
    await expect(async () => {
      await $`bun run build`.cwd(outDir);
    }).toThrow();
  }, 20_000);
});

describe("Astro v4 - valid path", () => {
  const outDir = path.join(rootDir, "./projects/v4-valid-path");
  const templateDir = path.join(rootDir, "./project-templates/v4/valid-path");

  beforeAll(async () => {
    await setupTestProject({
      outDir,
      templateDir,
      packageDir,
    });
  });

  afterAll(async () => {
    await cleanUpTestProject({
      dir: outDir,
    });
  });

  it("build without errors when project contains only valid links", async () => {
    await $`bun run build`.cwd(outDir);
  }, 20_000);
});

describe("Astro v5 - invalid path", () => {
  const outDir = path.join(rootDir, "./projects/v5-invalid-path");
  const templateDir = path.join(rootDir, "./project-templates/v5/invalid-path");

  beforeAll(async () => {
    await setupTestProject({
      outDir,
      templateDir,
      packageDir,
    });
  });

  afterAll(async () => {
    await cleanUpTestProject({
      dir: outDir,
    });
  });

  it("build fails when project contains an invalid link", async () => {
    await expect(async () => {
      await $`bun run build`.cwd(outDir);
    }).toThrow();
  }, 20_000);
});

describe("Astro v5 - valid path", () => {
  const outDir = path.join(rootDir, "./projects/v5-valid-path");
  const templateDir = path.join(rootDir, "./project-templates/v5/valid-path");

  beforeAll(async () => {
    await setupTestProject({
      outDir,
      templateDir,
      packageDir,
    });
  });

  afterAll(async () => {
    await cleanUpTestProject({
      dir: outDir,
    });
  });

  it("build without errors when project contains only valid links", async () => {
    await $`bun run build`.cwd(outDir);
  }, 20_000);
});

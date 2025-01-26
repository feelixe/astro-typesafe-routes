import { $ } from "bun";
import { rm, cp } from "node:fs/promises";
import path from "node:path";

const BUILD_DIR = "./dist";

async function cleanUp() {
  await rm(BUILD_DIR, { recursive: true, force: true });
}

async function build() {
  await cleanUp();

  await $`tsc`;

  const componentsOutDir = path.join(BUILD_DIR, "components");
  await cp("./src/components", componentsOutDir, { recursive: true });
}

try {
  await build();
} catch (error) {
  cleanUp();
  throw error;
}

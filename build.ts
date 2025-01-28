import { $ } from "bun";
import { rm, cp } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = import.meta.dir;
const BUILD_DIR = path.join(ROOT_DIR, "dist");

const COMPONENTS_SOURCE = path.join(ROOT_DIR, "src", "components");
const COMPONENTS_OUT = path.join(BUILD_DIR, "components");

async function cleanUp() {
  await rm(BUILD_DIR, { recursive: true, force: true });
}

async function build() {
  await cleanUp();
  await $`tsc`;
  await cp(COMPONENTS_SOURCE, COMPONENTS_OUT, { recursive: true });
}

try {
  await build();
} catch (error) {
  cleanUp();
  throw error;
}

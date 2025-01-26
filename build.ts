import { $ } from "bun";
import { rm, cp } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "./dist";

async function cleanUp() {
  await rm(OUT_DIR, { recursive: true });
}

async function build() {
  await cleanUp();

  await $`tsc`;

  const outComponents = path.join(OUT_DIR, "components");
  await cp("./src/components", outComponents, { recursive: true });
}

try {
  await build();
} catch (error) {
  cleanUp();
  throw error;
}

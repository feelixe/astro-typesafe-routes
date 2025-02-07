import { $ } from "bun";
import { rm, cp } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = import.meta.dir;
const BUILD_DIR = path.join(ROOT_DIR, "dist");
const FILES_TO_COPY = [
  {
    src: path.join(ROOT_DIR, "./src/components/link/astro/astro-link.astro"),
    dest: path.join(BUILD_DIR, "./components/link/astro/astro-link.astro"),
  },
];

async function cleanOutDirectory() {
  await rm(BUILD_DIR, { recursive: true, force: true });
}

async function build() {
  await cleanOutDirectory();
  await $`tsc`;
  for (const fileToCopy of FILES_TO_COPY) {
    await cp(fileToCopy.src, fileToCopy.dest, { recursive: true });
  }
}

try {
  await build();
  console.info("✅ Build completed");
} catch (error) {
  cleanOutDirectory();
  console.error("❌ Build failed");
  throw error;
}

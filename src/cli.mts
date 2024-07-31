#!/usr/bin/env node

import { Command } from "commander";
import * as core from "./index.mjs";

const program = new Command();

type Options = {
  pagesPath: string;
  outPath: string;
  watch: boolean;
};

program
  .name("astro-typesafe-routes")
  .description("Codegen CLI for creating typesafe Astro routes")
  .version("0.1.9");

program
  .command("generate")
  .description("Generate code for Astro routes")
  .option("-w, --watch", "re run codegen on route file change")
  .option(
    "-p, --pages-path <string>",
    "path to astro pages directory",
    "./src/pages",
  )
  .option(
    "-o, --out-path <string>",
    "path to output",
    "./src/astro-typesafe-routes.d.ts",
  )
  .action(async (options: Options) => {
    await core.runCodeGen(options);

    if (options.watch) {
      core.watch(options.pagesPath, async () => {
        await core.runCodeGen(options);
      });
    }
  });

program.parse();

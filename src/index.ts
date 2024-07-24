#!/usr/bin/env node

import { Command } from "commander";
import {
  getRoutes,
  getRouteFileContent,
  writeRouteFile,
  formatPrettier,
  logSuccess,
} from "./core";

const program = new Command();

type Options = {
  pagesPath: string;
  outPath: string;
  trailingSlash: boolean;
};

program
  .name("astro-typesafe-routes")
  .description("Codegen CLI for creating typesafe Astro routes")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate code for Astro routes")
  .option("-t, --trailing-slash", "default to adding trailing slash", false)
  .option(
    "-p, --pages-path <string>",
    "path to astro pages directory",
    "./src/pages"
  )
  .option(
    "-o, --out-path <string>",
    "path to output",
    "./src/astro-typesafe-routes.ts"
  )
  .action(async (options: Options) => {
    const routes = await getRoutes(options.pagesPath);
    const fileContent = await getRouteFileContent(
      routes,
      options.trailingSlash
    );
    const formattedContent = await formatPrettier(fileContent);

    await writeRouteFile(options.outPath, formattedContent);
    logSuccess(options.outPath);
  });

program.parse();

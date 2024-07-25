#!/usr/bin/env node

import { Command } from "commander";
import * as core from ".";

const program = new Command();

type Options = {
  pagesPath: string;
  outPath: string;
  trailingSlash: boolean;
  name: string;
};

program
  .name("astro-typesafe-routes")
  .description("Codegen CLI for creating typesafe Astro routes")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate code for Astro routes")
  .option("-t, --trailing-slash", "default to adding trailing slash", false)
  .option("-n, --name <string>", "name of the generated function", "$path")
  .option(
    "-p, --pages-path <string>",
    "path to astro pages directory",
    "./src/pages",
  )
  .option(
    "-o, --out-path <string>",
    "path to output",
    "./src/astro-typesafe-routes.ts",
  )
  .action(async (options: Options) => {
    if (!core.isValidFunctionName(options.name)) {
      throw new Error("Invalid function name");
    }

    const routes = await core.getRoutes(options.pagesPath);

    const fileContent = await core.getRouteFileContent(routes, {
      trailingSlash: options.trailingSlash,
      functionName: options.name,
    });
    const formattedContent = await core.formatPrettier(fileContent);
    await core.writeRouteFile(options.outPath, formattedContent);

    core.logSuccess(options.outPath);
  });

program.parse();

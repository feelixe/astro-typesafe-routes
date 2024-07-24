import { Command } from "commander";
import {
  listFiles,
  filterValidAstroFiles,
  trimRouteFileExtension,
  trimIndex,
  trimTrailingSlash,
  addLeadingSlash,
  getDynamicRouteInfo,
  getRouteFileContent,
  writeRouteFile,
  formatPrettier,
  logSuccess,
} from ".";

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
  .option("-p, --pages-path <string>", "path to astro pages directory", "./src/pages")
  .option(
    "-o, --out-path <string>",
    "path to output",
    "./src/astro-typesafe-routes.ts"
  )
  .action(async (options: Options) => {
    const files = await listFiles(options.pagesPath);
    const astroFiles = filterValidAstroFiles(files);
    const withoutExtension = trimRouteFileExtension(astroFiles);
    const withoutIndex = trimIndex(withoutExtension);
    const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
    const withLeading = addLeadingSlash(withoutTrailingSlash);
    const dynamicRoutes = getDynamicRouteInfo(withLeading);

    const fileContent = await getRouteFileContent(dynamicRoutes, options.trailingSlash);
    const formattedContent = await formatPrettier(fileContent);

    await writeRouteFile(options.outPath, formattedContent);

    logSuccess(options.outPath);
  });

program.parse();

import * as fs from "node:fs/promises";

export async function doesRouteHaveSearchSchema(absoluteRoutePath: string) {
  const routeContent = await fs.readFile(absoluteRoutePath, "utf-8");
  return routeContent.includes("searchSchema:");
}

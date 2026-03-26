import { readFile } from "node:fs/promises";
import type { ResolvedRoute } from "./types.js";
import { writeFile } from "node:fs/promises";

const routeIdPattern = /(routeId:\s*(['"]))(.*?)\2/;

/**
 * - Updates the `routeId` argument of `createRoute` calls.
 */
export async function updateRouteId(route: ResolvedRoute) {
  const content = await readFile(route.absolutePath, "utf-8");
  const result = content.replace(routeIdPattern, `$1${route.path}$2`);
  if (result === content) {
    return;
  }

  await writeFile(route.absolutePath, result);
}

import * as fs from "node:fs/promises";
import * as ts from "typescript";
import { parse } from "@astrojs/compiler";
import type { ResolvedRoute } from "./types.js";
import { replaceRange } from "../helpers/string.js";
import { findNode } from "../helpers/ast.js";

const createRouteFnName = "createRoute";
const routeIdFieldName = "routeId";

/**
 * Returns the `id` argument of a `createRoute` call
 */
function extractRouteIdCallArgumentFromNode(node: ts.CallExpression) {
  const firstArgument = node.arguments[0];
  if (!firstArgument || !ts.isObjectLiteralExpression(firstArgument)) {
    return;
  }

  const match = firstArgument.properties.find(
    (el) =>
      ts.isPropertyAssignment(el) && ts.isIdentifier(el.name) && el.name.text === routeIdFieldName,
  ) as ts.PropertyAssignment | undefined;

  return match?.initializer;
}

function getRouteIdCallArgument(node: ts.Node): ts.Expression | undefined {
  return findNode(node, (child) => {
    if (!ts.isCallExpression(child)) {
      return;
    }
    const expr = child.expression;
    if (expr.getText() !== createRouteFnName) {
      return;
    }
    const match = extractRouteIdCallArgumentFromNode(child);
    return match;
  });
}

/**
 * - Updates the `routeId` argument of `createRoute` calls.
 */
export async function updateRouteId(route: ResolvedRoute) {
  // Load and parse the Astro route file.
  const astroFile = await fs.readFile(route.absolutePath, "utf-8");

  const parseResult = await parse(astroFile);

  // Check if there is a frontmatter.
  const frontmatter = parseResult.ast.children?.find((child) => child.type === "frontmatter");
  if (!frontmatter || !frontmatter.position) {
    return;
  }

  // Check if the frontmatter can be found in the original file, should always be true.
  const leadingLength = astroFile.indexOf(frontmatter.value);
  if (leadingLength === -1) {
    return;
  }

  // Parse the frontmatter with Typescript.
  const sourceFile = ts.createSourceFile(
    "index.ts",
    frontmatter.value,
    ts.ScriptTarget.ESNext,
    true,
  );

  // Try to find the `id` argument of a call to `createRoute`.
  const callArg = getRouteIdCallArgument(sourceFile);
  if (!callArg) {
    return;
  }

  // Calculate the start and end position of the `id` argument.
  const frontmatterStart = frontmatter.position.start;
  const replaceStart = leadingLength + frontmatterStart.offset + callArg.getStart() + 1;
  const replaceEnd = leadingLength + frontmatterStart.offset + callArg.getEnd() - 1;

  // If the `id` argument matches the current route, do nothing.
  const currentRouteId = astroFile.slice(replaceStart, replaceEnd);
  if (currentRouteId === route.path) {
    return;
  }

  // Replace the `routeId` argument with the new routeId.
  const newContent = replaceRange(astroFile, route.path, replaceStart, replaceEnd);
  await fs.writeFile(route.absolutePath, newContent, { encoding: "utf-8" });
}

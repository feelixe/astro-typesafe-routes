import * as fs from "node:fs/promises";
import * as ts from "typescript";
import { parse } from "@astrojs/compiler";
import type { ResolvedRoute } from "./types.js";

function replaceBetweenOffsets(original: string, newText: string, start: number, end: number) {
  return original.substring(0, start) + newText + original.substring(end);
}

/**
 * Checks if the node is a call to `createRoute`
 */
function isCreateRouteCall(node: ts.Node): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const expr = node.expression;
  return expr.getText() === "createRoute";
}

/**
 * Returns the `id` argument of the `createRoute` call
 */
function getIdCallArg(node: ts.CallExpression) {
  const firstCallArg = node.arguments[0];
  if (!firstCallArg) {
    return;
  }

  if (!ts.isObjectLiteralExpression(firstCallArg)) {
    return;
  }

  const match = firstCallArg.properties.find(
    (el) => ts.isPropertyAssignment(el) && ts.isIdentifier(el.name) && el.name.text === "id",
  ) as ts.PropertyAssignment | undefined;

  return match?.initializer;
}

function findIdCallArg(node: ts.Node): ts.Expression | undefined {
  const children = node.getChildren();

  for (const child of children) {
    if (isCreateRouteCall(child)) {
      const callArg = getIdCallArg(child);
      if (callArg) {
        return callArg;
      }
    }
    const result = findIdCallArg(child);
    if (result) {
      return result;
    }
  }
  return undefined;
}

export async function routeGenerator(route: ResolvedRoute) {
  const astroFile = await fs.readFile(route.absolutePath, "utf-8");

  const parseResult = await parse(astroFile);

  const frontmatter = parseResult.ast.children.find((child) => child.type === "frontmatter");
  if (!frontmatter || !frontmatter.position) {
    return;
  }

  const sourceFile = ts.createSourceFile(
    "index.ts",
    frontmatter.value,
    ts.ScriptTarget.ESNext,
    true,
  );

  const callArg = findIdCallArg(sourceFile);

  if (!callArg) {
    return;
  }

  const frontmatterStart = frontmatter.position.start;
  const leadingLength = astroFile.indexOf(frontmatter.value);
  if (leadingLength === -1) {
    return;
  }

  const replaceStart = leadingLength + frontmatterStart.offset + callArg.getStart() + 1;
  const replaceEnd = leadingLength + frontmatterStart.offset + callArg.getEnd() - 1;

  const currentRouteId = astroFile.slice(replaceStart, replaceEnd);
  if (currentRouteId === route.path) {
    return;
  }

  const newContent = replaceBetweenOffsets(astroFile, route.path, replaceStart, replaceEnd);

  await fs.writeFile(route.absolutePath, newContent, { encoding: "utf-8" });
}

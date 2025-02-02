import { transform } from "@astrojs/compiler";
import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

interface ComputedTypeResult {
  [key: string]: string;
}

export function getSearchParamSchema(sourceCode: string): ComputedTypeResult {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const result: ComputedTypeResult = {};

  ts.forEachChild(sourceFile, (node) => {
    console.log(node.getFullText());
    console.log(node.kind);
    console.log("_---");
    if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text === "SearchParams" &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      // Directly process object type literals
      if (ts.isTypeLiteralNode(node.type)) {
        node.type.members.forEach((member) => {
          if (ts.isPropertySignature(member) && member.type) {
            const name = member.name.getText(sourceFile);
            const type = member.type.getText(sourceFile);
            result[name] = type;
          }
        });
      }
      // Handle direct interface references (single interface)
      else if (ts.isTypeReferenceNode(node.type)) {
        const interfaceName = node.type.typeName.getText(sourceFile);

        ts.forEachChild(sourceFile, (interfaceNode) => {
          if (
            ts.isInterfaceDeclaration(interfaceNode) &&
            interfaceNode.name.text === interfaceName
          ) {
            interfaceNode.members.forEach((member) => {
              if (ts.isPropertySignature(member) && member.type) {
                const name = member.name.getText(sourceFile);
                const type = member.type.getText(sourceFile);
                result[name] = type;
              }
            });
          }
        });
      }
    }
  });

  return result;
}

const astroFile = await readFile("./example/src/pages/index.astro", "utf-8");

const tsFile = await transform(astroFile, {
  filename: "index.astro",
  sourcemap: "external",
  internalURL: "astro/runtime/server/index.js",
});

const computedType = getSearchParamSchema(tsFile.code);

import * as astroCompiler from "@astrojs/compiler";
import * as fs from "node:fs/promises";
import * as ts from "typescript";

function isNodeExported(node: ts.VariableStatement) {
	return node.modifiers?.some(
		(mod) => mod.kind === ts.SyntaxKind.ExportKeyword,
	);
}

export async function doesRouteHaveSearchSchema(absoluteRoutePath: string) {
	const astroFile = await fs.readFile(absoluteRoutePath, "utf-8");

	const tsFile = await astroCompiler.transform(astroFile, {
		filename: "index.astro",
		sourcemap: "external",
		internalURL: "astro/runtime/server/index.js",
	});

	const tsFileSource = tsFile.code;

	const sourceFile = ts.createSourceFile(
		"index.ts",
		tsFileSource,
		ts.ScriptTarget.Latest,
		true,
	);

	const hasSearchExport = ts.forEachChild(sourceFile, (node) => {
		if (ts.isVariableStatement(node) && isNodeExported(node)) {
			for (const decl of node.declarationList.declarations) {
				if (ts.isIdentifier(decl.name) && decl.name.text === "searchSchema") {
					return true;
				}
			}
		} else if (ts.isExportDeclaration(node)) {
			if (node.exportClause && ts.isNamedExports(node.exportClause)) {
				for (const element of node.exportClause.elements) {
					if (element.name.text === "searchSchema") {
						return true;
					}
				}
			}
		}
		return false;
	});

	return hasSearchExport ?? false;
}

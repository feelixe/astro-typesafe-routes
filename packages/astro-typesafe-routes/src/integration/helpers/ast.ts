import type ts from "typescript";

export function findNode<T extends ts.Node>(
  node: ts.Node,
  matcher: (child: ts.Node) => T | undefined,
): T | undefined {
  const match = matcher(node);
  if (match) {
    return match;
  }
  const children = node.getChildren();
  for (const child of children) {
    const result = findNode(child, matcher);
    if (result) {
      return result;
    }
  }
  return;
}

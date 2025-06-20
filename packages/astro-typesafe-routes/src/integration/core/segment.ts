import type { RoutePart } from "astro";

/**
 * Converts an array of route segments into a path string.
 */
export function segmentsToPath(segments: RoutePart[][]) {
  const routeParts = segments.map((segment) => {
    return segment
      .map((part) => {
        if (part.dynamic) {
          return `[${part.content}]`;
        }
        return part.content;
      })
      .join("");
  });

  return `/${routeParts.join("/")}`;
}

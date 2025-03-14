import type { AstroGlobal } from "astro";

export function getParams(astro: AstroGlobal, _: string) {
  return astro.params;
}

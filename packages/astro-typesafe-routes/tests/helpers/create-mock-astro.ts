import type { AstroGlobal } from "astro";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function createMockAstro(value: DeepPartial<AstroGlobal>) {
  return value as AstroGlobal;
}

import * as path from "node:path";

export function normalizeSeparators(value: string) {
  return value.replaceAll(path.win32.sep, path.posix.sep);
}

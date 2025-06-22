export function replaceRange(original: string, newText: string, start: number, end: number) {
  return original.substring(0, start) + newText + original.substring(end);
}

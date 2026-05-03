export async function tryFormatPrettier(content: string) {
  let formatted = content;
  try {
    // @ts-ignore optional prettier formatting
    const prettier = await import("prettier");
    formatted = await prettier.format(content, {
      parser: "typescript",
      plugins: [],
    });
    return formatted;
  } catch {}
  return formatted;
}

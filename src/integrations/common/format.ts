export async function tryFormatPrettier(content: string) {
  try {
    // @ts-ignore optional prettier formatting
    const prettier = await import("prettier");
    content = await prettier.format(content, {
      parser: "typescript",
      plugins: [],
    });
    return content;
  } catch {}
  return content;
}

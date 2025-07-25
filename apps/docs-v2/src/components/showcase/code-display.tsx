import { useState } from "react";
import { AutocompletePopup, AutocompletePopupLine, Caret, Code, CodeBlock } from "./code.tsx";

export function CodeDisplay() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <CodeBlock className="max-w-lg mx-auto mb-16">
      <Code c="darkGreen">---</Code>
      <br />
      <Code c="pink">import </Code>
      <Code c="blue">Link </Code>
      <Code c="pink">from </Code>
      <Code c="orange">"astro-typesafe-routes/link"</Code>
      <Code c="white">;</Code>
      <br />
      <Code c="darkGreen">---</Code>
      <br />
      <br />
      <div className="relative">
        <Code c="gray">&lt;</Code>
        <Code c="green">Link </Code>
        <Code c="blue">to</Code>
        <Code c="white">=</Code>
        <Code c="orange">"</Code>
        {selected && <Code c="orange">{selected}</Code>}
        <Caret />
        <Code c="orange">"</Code>
        {selected && <Code c="gray">&gt;</Code>}

        {!selected && (
          <AutocompletePopup className="absolute top-7 left-22">
            <AutocompletePopupLine onClick={() => setSelected("/")} active>
              /
            </AutocompletePopupLine>
            <AutocompletePopupLine onClick={() => setSelected("/about")}>
              /about
            </AutocompletePopupLine>
            <AutocompletePopupLine onClick={() => setSelected("/blog/[slug]")}>
              /blog/[slug]
            </AutocompletePopupLine>
          </AutocompletePopup>
        )}
      </div>
      &nbsp;&nbsp;<Code c="white">Blog</Code>
      <br />
      <Code c="gray">&lt;/</Code>
      <Code c="green">Link</Code>
      <Code c="gray">&gt;</Code>
    </CodeBlock>
  );
}

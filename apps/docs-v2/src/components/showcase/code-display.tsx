import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { AutocompletePopup, AutocompletePopupLine, Caret, Code, CodeBlock } from "./code.tsx";

export function CodeDisplay() {
  const [selectVisible, setSelectVisible] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const select = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
    e.stopPropagation();
    setSelected(value);
    setSelectVisible(false);
  };

  return (
    <CodeBlock
      className="max-w-lg mx-auto mb-20"
      style={{
        boxShadow: "0px 0px 80px -10px oklch(91.542% 0.07 16.901 / 0.07)",
      }}
      onClick={() => {
        setSelectVisible(true);
      }}
    >
      <Code c="darkGreen">---</Code>
      <br />
      <Code c="pink">import </Code>
      <Code c="lightBlue">Link </Code>
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
        <Code c="lightBlue">to</Code>
        <Code c="white">=</Code>
        <Code c="orange">"</Code>
        {selected && <Code c="orange">{selected}</Code>}
        <Caret />
        <Code c="orange">"</Code>
        {selected && <Code c="gray">&gt;</Code>}

        {selectVisible && (
          <AutocompletePopup className="absolute top-7 left-22">
            <AutocompletePopupLine onClick={(e) => select(e, "/")} active>
              /
            </AutocompletePopupLine>
            <AutocompletePopupLine onClick={(e) => select(e, "/about")}>
              /about
            </AutocompletePopupLine>
            <AutocompletePopupLine onClick={(e) => select(e, "/blog/[slug]")}>
              /blog/[slug]
            </AutocompletePopupLine>
          </AutocompletePopup>
        )}
      </div>
      &nbsp;&nbsp;<Code c="white">About</Code>
      <br />
      <Code c="gray">&lt;/</Code>
      <Code c="green">Link</Code>
      <Code c="gray">&gt;</Code>
    </CodeBlock>
  );
}

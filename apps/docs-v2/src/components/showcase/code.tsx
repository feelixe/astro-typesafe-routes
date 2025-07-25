import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";
import { CodeSuggestionIcon } from "../icons/code-suggestion-icon.tsx";

export type CodeBlockProps = ComponentProps<"div">;

export function CodeBlock(props: CodeBlockProps) {
  const { className, children, ...rest } = props;

  return (
    <div
      className={cn("font-mono bg-card border border-border rounded px-4 py-3 bg-card", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

type CodeColor = "darkGreen" | "green" | "pink" | "blue" | "orange" | "white" | "gray";

const codeColors: Record<CodeColor, string> = {
  darkGreen: "#74985d",
  green: "#71c6b1",
  pink: "#bc89bd",
  blue: "#aadafa",
  orange: "#c5947c",
  white: "#cccccc",
  gray: "#808080",
};

export type CodeProps = ComponentProps<"span"> & {
  c: CodeColor;
};

export function Code(props: CodeProps) {
  const { className, children, style, ...rest } = props;

  return (
    <span
      className={cn("", className)}
      style={{
        color: codeColors[props.c],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export type CaretProps = ComponentProps<"div">;

export function Caret(props: CaretProps) {
  const { className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "inline-block w-[2px] h-[1.2em] bg-[#aeafad] align-middle mx-1px caret-blink",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type AutocompletePopupProps = ComponentProps<"div">;

export function AutocompletePopup(props: AutocompletePopupProps) {
  const { className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "min-w-60 sm:min-w-sm inline-block rounded border-2 border-[#454545] bg-[#202020]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type AutocompletePopupLineProps = ComponentProps<"button"> & {
  active?: boolean;
};

export function AutocompletePopupLine(props: AutocompletePopupLineProps) {
  const { className, children, active, ...rest } = props;

  return (
    <button
      type="button"
      className={cn(
        "flex px-1.5 py-0.5 items-center gap-1.5 text-sm text-[#cccccc] cursor-pointer w-full",
        active && "bg-[#16385b] text-white",
        className,
      )}
      {...rest}
    >
      <CodeSuggestionIcon className="size-5" />
      {children}
    </button>
  );
}

import type { ComponentProps } from "react";

export function CodeSuggestionIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Code Suggestion Icon</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M26 0C27.1046 3.86553e-07 28 0.895431 28 2V18C28 19.1046 27.1046 20 26 20H2C0.895431 20 1.61067e-08 19.1046 0 18V2C2.57706e-07 0.895431 0.895431 4.83192e-08 2 0H26ZM2 2V18H26V2H2Z"
        fill="#C4C4C4"
      />
      <path d="M6 6H22V8H6V6Z" fill="#C4C4C4" />
      <path d="M6 12H22V14H6V12Z" fill="#C4C4C4" />
    </svg>
  );
}

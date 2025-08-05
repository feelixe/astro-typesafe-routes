import type { ComponentProps } from "react";

export function NpmIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>npm logo</title>
      <path d="M10 10H0V0H10V10ZM1 9H5V3H7V9H9V1H1V9Z" />
    </svg>
  );
}

import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";

export type ContainerProps = ComponentProps<"div">;

export function Container(props: ContainerProps) {
  const { children, className, ...rest } = props;

  return (
    <div className={cn("max-w-6xl mx-auto px-6 py-2", className)} {...rest}>
      {children}
    </div>
  );
}

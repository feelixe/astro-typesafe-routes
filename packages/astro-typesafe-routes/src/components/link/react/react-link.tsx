import type { ComponentProps } from "react";
import { $path, type RouteOptions } from "../../../path.js";

export type ReactLinkProps = Omit<ComponentProps<"a">, "href"> & RouteOptions;

export default function Link(props: ReactLinkProps) {
  const { children, to, params, search, searchParams, hash, trailingSlash, ...anchorProps } = props;

  const href = $path({ to, params, search, searchParams, hash, trailingSlash });

  return (
    <a href={href} {...anchorProps}>
      {children}
    </a>
  );
}

import type { ComponentProps } from "react";
import { Container } from "../ui/container.tsx";
import { cn } from "../../lib/utils.ts";
import { GitHubIcon } from "../icons/github-icon.tsx";
import { Button } from "../ui/button.tsx";
import { NpmIcon } from "../icons/npm-icon.tsx";
import Link from "astro-typesafe-routes/link/react";
import { Sidebar } from "./sidebar.tsx";

export type NavbarProps = ComponentProps<"div">;

export function Navbar(props: NavbarProps) {
  const { children, className, ...rest } = props;

  return (
    <div className={cn("", className)} {...rest}>
      <Container className="py-5 flex items-center gap-1">
        <Link to="/" className="font-semibold tracking-tight">
          Astro Typesafe Routes
        </Link>
        <div className="grow" />
        <Button variant="ghost" asChild>
          <Link to="/documentation">Documentation</Link>
        </Button>
        <Button variant="ghost" asChild>
          <a href="https://www.npmjs.com/package/astro-typesafe-routes">
            <NpmIcon className="size-3.5" />
            npm
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="https://github.com/feelixe/astro-typesafe-routes">
            <GitHubIcon className="size-3.5" />
            Github
          </a>
        </Button>
      </Container>
    </div>
  );
}

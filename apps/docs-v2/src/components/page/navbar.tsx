import { useState, type ComponentProps } from "react";
import { Container } from "../ui/container.tsx";
import { cn } from "../../lib/utils.ts";
import { GitHubIcon } from "../icons/github-icon.tsx";
import { Button } from "../ui/button.tsx";
import { NpmIcon } from "../icons/npm-icon.tsx";
import Link from "astro-typesafe-routes/link/react";
import { HomeIcon, MenuIcon, XIcon } from "lucide-react";
import { Sidebar } from "./sidebar.tsx";
import type { RouteId } from "astro-typesafe-routes/path";
import { ChangeVersion, type Version } from "../change-version.tsx";

export type NavbarProps = ComponentProps<"div"> & {
  activeRouteId: RouteId;
  version?: Version | undefined;
};

export function Navbar(props: NavbarProps) {
  const { activeRouteId, children, className, version = "v5.0.0", ...rest } = props;

  const [open, setOpen] = useState(false);

  return (
    <div className={cn("", className)} {...rest}>
      <Container className="py-5 flex items-center gap-1">
        <Link to="/" className="font-semibold tracking-tight mr-3">
          Astro Typesafe Routes
        </Link>

        <ChangeVersion value={version} />

        <div className="grow" />

        <div className="hidden sm:block">
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
        </div>

        <div className="block sm:hidden">
          <Button size="icon-lg" variant="ghost" onClick={() => setOpen((prev) => !prev)}>
            <MenuIcon className="size-6" />
          </Button>
        </div>

        <div
          className={cn(
            "fixed flex-col items-center top-0 left-0 bottom-0 right-0 bg-black/70 backdrop-blur-lg z-50 px-6 py-8",
            open ? "flex" : "hidden",
          )}
        >
          <div className="w-full grow flex flex-col gap-1">
            <div className="font-semibold tracking-tight mb-6">Astro Typesafe Routes</div>
            <Button
              variant={activeRouteId === "/" ? "default" : "ghost"}
              size="lg"
              asChild
              className="w-full justify-start"
            >
              <Link to="/">
                <HomeIcon className="size-5" />
                Home
              </Link>
            </Button>

            <Sidebar className="w-full" activeRouteId={activeRouteId} />

            <Button variant="ghost" size="lg" asChild className="w-full justify-start">
              <a href="https://www.npmjs.com/package/astro-typesafe-routes">
                <NpmIcon className="size-5" />
                npm
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild className="w-full justify-start">
              <a href="https://github.com/feelixe/astro-typesafe-routes">
                <GitHubIcon className="size-5" />
                Github
              </a>
            </Button>
          </div>

          <button type="button" className="size-16 p-2" onClick={() => setOpen(false)}>
            <XIcon className="size-full" />
          </button>
        </div>
      </Container>
    </div>
  );
}

import { useState, type ComponentProps } from "react";
import { Container } from "../ui/container.tsx";
import { cn } from "../../lib/utils.ts";
import { GitHubIcon } from "../icons/github-icon.tsx";
import { Button } from "../ui/button.tsx";
import { NpmIcon } from "../icons/npm-icon.tsx";
import Link from "astro-typesafe-routes/link/react";
import { MenuIcon, XIcon } from "lucide-react";
import { DataSelect } from "../ui/select.tsx";

export type NavbarProps = ComponentProps<"div">;

export function Navbar(props: NavbarProps) {
  const { children, className, ...rest } = props;

  const [open, setOpen] = useState(false);

  const value = "5.0.0";

  return (
    <div className={cn("", className)} {...rest}>
      <Container className="py-5 flex items-center gap-1">
        <Link to="/" className="font-semibold tracking-tight mr-3">
          Astro Typesafe Routes
        </Link>

        <DataSelect
          value={value}
          items={[
            {
              value: "4.0.0",
              label: "v4.0.0",
            },
            {
              value: "5.0.0",
              label: "v5.0.0",
            },
          ]}
        />

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
          <div className="w-full grow flex flex-col gap-3">
            <div className="font-semibold tracking-tight mb-6">Astro Typesafe Routes</div>

            <Button variant="secondary" size="xl" asChild className="w-full">
              <Link to="/">Home</Link>
            </Button>

            <Button variant="secondary" size="xl" asChild className="w-full">
              <Link to="/documentation">Documentation</Link>
            </Button>

            <Button variant="secondary" size="xl" asChild className="w-full">
              <a href="https://www.npmjs.com/package/astro-typesafe-routes">
                <NpmIcon className="size-3.5" />
                npm
              </a>
            </Button>
            <Button variant="secondary" size="xl" asChild className="w-full">
              <a href="https://github.com/feelixe/astro-typesafe-routes">
                <GitHubIcon className="size-3.5" />
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

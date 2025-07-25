import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";
import { Button } from "../ui/button.tsx";
import { $path, type RouteId, type RouteOptions } from "astro-typesafe-routes/path";
import {
  ChevronUpIcon,
  FolderUpIcon,
  HandHelpingIcon,
  PackagePlusIcon,
  SettingsIcon,
} from "lucide-react";
import { Badge } from "../ui/badge.tsx";

export type SidebarProps = Omit<ComponentProps<"div">, "children"> & {
  activeRouteId: RouteId;
};

export function Sidebar(props: SidebarProps) {
  const { className, activeRouteId, ...rest } = props;

  return (
    <div className={cn("w-64 flex flex-col gap-1 shrink-0", className)} {...rest}>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation" }}>
        <PackagePlusIcon className="size-5" />
        Installation
      </SidebarButton>
      <SidebarGroupButton title="Usage">
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation/usage/link" }}>
          Link
        </SidebarButton>

        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation/usage/path" }}>
          Path Function
        </SidebarButton>

        <SidebarButton
          activeRouteId={activeRouteId}
          link={{ to: "/documentation/usage/create-route" }}
        >
          Create Route
          <Badge variant="outline">New</Badge>
        </SidebarButton>

        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Typed Search Params
        </SidebarButton>

        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Read Params
        </SidebarButton>
      </SidebarGroupButton>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation/configuration" }}>
        <SettingsIcon className="size-5" />
        Configuration
      </SidebarButton>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation/contributing" }}>
        <HandHelpingIcon className="size-5" />
        Contributing
      </SidebarButton>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation/migrating" }}>
        <FolderUpIcon className="size-5" />
        Migrating from 4.0.0
      </SidebarButton>
    </div>
  );
}

export type SidebarWrapperProps = ComponentProps<"div">;

export function SidebarWrapper(props: SidebarWrapperProps) {
  const { className, children, ...rest } = props;

  return (
    <div className={cn("flex gap-6", className)} {...rest}>
      {children}
    </div>
  );
}

export type SidebarContentProps = ComponentProps<"div">;

export function SidebarContent(props: SidebarContentProps) {
  const { className, children, ...rest } = props;

  return (
    <div className={cn("grow", className)} {...rest}>
      {children}
    </div>
  );
}

export type SidebarButtonProps<T extends RouteId> = ComponentProps<typeof Button> & {
  link: RouteOptions<T>;
  activeRouteId: RouteId;
};

export function SidebarButton<T extends RouteId>(props: SidebarButtonProps<T>) {
  const { className, children, link, activeRouteId, ...rest } = props;

  const href = $path(link);

  const active = link.to === activeRouteId;

  return (
    <Button
      asChild
      variant={active ? "default" : "ghost"}
      size="lg"
      className={cn("w-full justify-start", className)}
      {...rest}
    >
      <a href={href}>{children}</a>
    </Button>
  );
}

export type SidebarGroupButtonProps = ComponentProps<"div"> & {
  title: string;
};

export function SidebarGroupButton(props: SidebarGroupButtonProps) {
  const { children, title, className, ...rest } = props;

  return (
    <div className="">
      <Button disabled variant="ghost" size="lg" className="w-full justify-between">
        {title}
        <ChevronUpIcon className="size-4" />
      </Button>
      <div className={cn("pl-5", className)} {...rest}>
        {children}
      </div>
    </div>
  );
}

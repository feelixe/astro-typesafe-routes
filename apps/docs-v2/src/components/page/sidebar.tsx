import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";
import { Button } from "../ui/button.tsx";
import { $path, type RouteId, type RouteOptions } from "astro-typesafe-routes/path";
import { FolderUpIcon, HandHelpingIcon, PackagePlusIcon, SettingsIcon } from "lucide-react";
import { Badge } from "../ui/badge.tsx";
import type { Version } from "@/lib/version.ts";

export type SidebarProps = Omit<ComponentProps<"div">, "children"> & {
  activeRouteId: RouteId;
  version?: Version | undefined;
};

export function Sidebar(props: SidebarProps) {
  const { className, activeRouteId, version = "v5.0.0", ...rest } = props;

  if (version === "v4.0.0") {
    return (
      <div className={cn("w-64 flex flex-col gap-1 shrink-0", className)} {...rest}>
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/4.0.0/documentation" }}>
          <PackagePlusIcon className="size-5" />
          Installation
        </SidebarButton>

        <SidebarGroup title="usage">
          <SidebarButton
            activeRouteId={activeRouteId}
            link={{ to: "/4.0.0/documentation/usage/link" }}
          >
            Link
          </SidebarButton>
          <SidebarButton
            activeRouteId={activeRouteId}
            link={{ to: "/4.0.0/documentation/usage/path" }}
          >
            Path Function
          </SidebarButton>
          <SidebarButton
            activeRouteId={activeRouteId}
            link={{ to: "/4.0.0/documentation/usage/optional-fields" }}
          >
            Optional Fields
          </SidebarButton>
          <SidebarButton
            activeRouteId={activeRouteId}
            link={{ to: "/4.0.0/documentation/usage/typed-search-params" }}
          >
            Typed Search Param
          </SidebarButton>
          <SidebarButton
            activeRouteId={activeRouteId}
            link={{ to: "/4.0.0/documentation/usage/get-params" }}
          >
            Get Params
          </SidebarButton>
        </SidebarGroup>

        <SidebarButton
          activeRouteId={activeRouteId}
          link={{ to: "/4.0.0/documentation/configuration" }}
        >
          <SettingsIcon className="size-5" />
          Configuration
        </SidebarButton>
        <SidebarButton
          activeRouteId={activeRouteId}
          link={{ to: "/4.0.0/documentation/migrating" }}
        >
          <FolderUpIcon className="size-5" />
          Migrating from 3.0.0
        </SidebarButton>
      </div>
    );
  }

  return (
    <div className={cn("w-64 flex flex-col gap-1 shrink-0", className)} {...rest}>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation" }}>
        <PackagePlusIcon className="size-5" />
        Installation
      </SidebarButton>
      <SidebarGroup title="usage">
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

        <SidebarButton
          activeRouteId={activeRouteId}
          link={{ to: "/documentation/usage/typed-search-params" }}
        >
          Typed Search Params
        </SidebarButton>
      </SidebarGroup>
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
    <div className={cn("overflow-y-scroll", className)} {...rest}>
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

export type SidebarGroupProps = ComponentProps<"div"> & {
  title: string;
};

export function SidebarGroup(props: SidebarGroupProps) {
  const { children, title, className, ...rest } = props;

  return (
    <div className="mt-2 mb-2">
      <div className="text-xs pl-3 mb-3">{title}/</div>
      <div className={cn("pl-2 border-l border-border ml-4", className)} {...rest}>
        {children}
      </div>
    </div>
  );
}

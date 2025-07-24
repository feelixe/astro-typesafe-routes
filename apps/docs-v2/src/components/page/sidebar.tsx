import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";
import { Button } from "../ui/button.tsx";
import { $path, type RouteId, type RouteOptions } from "astro-typesafe-routes/path";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.tsx";
import { ChevronDownIcon } from "lucide-react";

export type SidebarProps = Omit<ComponentProps<"div">, "children"> & {
  activeRouteId: RouteId;
};

export function Sidebar(props: SidebarProps) {
  const { className, activeRouteId, ...rest } = props;

  return (
    <div className={cn("w-64 shrink-0", className)} {...rest}>
      <SidebarButton activeRouteId={activeRouteId} link={{ to: "/documentation" }}>
        Installation
      </SidebarButton>
      <SidebarGroupButton title="Usage">
        <SidebarButton
          activeRouteId={activeRouteId}
          link={{ to: "/documentation/usage/link-component" }}
        >
          Link Component
        </SidebarButton>
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Path Function
        </SidebarButton>
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Optional Fields
        </SidebarButton>
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Typed Search Params
        </SidebarButton>
        <SidebarButton activeRouteId={activeRouteId} link={{ to: "/" }}>
          Read Params
        </SidebarButton>
      </SidebarGroupButton>
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

export type SidebarGroupButtonProps = ComponentProps<typeof Collapsible> & {
  title: string;
};

export function SidebarGroupButton(props: SidebarGroupButtonProps) {
  const { children, title, className, ...rest } = props;

  return (
    <Collapsible defaultOpen className={cn("group", className)} {...rest}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="lg" className={cn("w-full justify-between")}>
          {title}
          <ChevronDownIcon className="size-4 transition-transform group-data-[state='open']:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}

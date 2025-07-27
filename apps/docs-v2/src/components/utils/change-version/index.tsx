import type { ComponentProps } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.tsx";
import { $path, type RouteId } from "astro-typesafe-routes/path";
import { resolveVersionedRoute, versions, type Version } from "@/lib/version.ts";

export type ChangeVersionProps = Partial<ComponentProps<typeof Select>> & {
  value: Version;
  activeRouteId: RouteId;
};

export function ChangeVersion(props: ChangeVersionProps) {
  const navigateToVersion = (version: Version) => {
    const matchingRoute = resolveVersionedRoute(props.activeRouteId, version);

    window.location.href = $path({ to: matchingRoute });
  };

  return (
    <Select value={props.value} onValueChange={navigateToVersion}>
      <SelectTrigger size="sm" className="w-[90px]">
        <SelectValue placeholder={props.value} />
      </SelectTrigger>
      <SelectContent>
        {versions.map((version) => (
          <SelectItem key={version} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

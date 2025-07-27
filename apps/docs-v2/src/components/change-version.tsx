import type { ComponentProps } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.tsx";
import { $path } from "astro-typesafe-routes/path";

export const versions = ["v4.0.0", "v5.0.0"] as const;

export type Version = (typeof versions)[number];

export type ChangeVersionProps = Partial<ComponentProps<typeof Select>> & {
  value: Version;
};

export function ChangeVersion(props: ChangeVersionProps) {
  const navigateToVersion = (version: Version) => {
    if (version === "v4.0.0") {
      window.location.href = $path({ to: "/4.0.0/documentation" });
      return;
    }
    window.location.href = $path({ to: "/documentation" });
  };

  return (
    <Select onValueChange={navigateToVersion}>
      <SelectTrigger className="w-[90px]">
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

import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";

export type TocSidebarProps = ComponentProps<"ul"> & {
  markdownString: string;
};

const pattern = /^## (?<title>.+)$/;

export function TocSidebar(props: TocSidebarProps) {
  const { markdownString, className, children, ...rest } = props;

  const subHeadings = markdownString
    .split("\n")
    .map((line) => {
      const regexMatch = pattern.exec(line);
      const title = regexMatch?.groups?.title;
      if (!title) {
        return null;
      }
      const slug = title
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^\w-]+/g, "");

      const cleanedTitle = title.replace(/[^\w ]/g, "");

      return {
        title: cleanedTitle,
        slug,
      };
    })
    .filter((el) => el !== null);

  return (
    <ul
      className={cn("w-32 shrink-0 text-sm flex flex-col gap-2 text-muted-foreground", className)}
      {...rest}
    >
      {subHeadings.map(({ title, slug }) => (
        <li key={slug}>
          <a className="hover:underline" href={`#${slug}`}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}

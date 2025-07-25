import { CopyIcon } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { Button } from "../ui/button.tsx";
import { Separator } from "../ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import { CodeBlock, type CodeBlockProps } from "./code.tsx";
import { NpmIcon } from "../icons/npm-icon.tsx";
import { PnpmIcon } from "../icons/pnpm-logo.tsx";
import { BunIcon } from "../icons/bun-icon.tsx";
import { usePreferredPackageManager } from "../../hooks/use-preferred-package-manager.ts";
import { useEffect, useState } from "react";
import seedrandom from "seedrandom";

export type QuickStartProps = CodeBlockProps;

const options = [
  {
    packageManager: "npm",
    command: "npx astro add astro-typesafe-routes",
    icon: NpmIcon,
  },
  {
    packageManager: "pnpm",
    command: "pnpm exec astro add astro-typesafe-routes",
    icon: PnpmIcon,
  },
  {
    packageManager: "bun",
    command: "bunx astro add astro-typesafe-routes",
    icon: BunIcon,
  },
];

export function QuickStart(props: QuickStartProps) {
  const { className, ...rest } = props;

  const [copyCount, setCopyCount] = useState(0);
  const [copyIds, setCopyIds] = useState<number[]>([]);

  const preferredPackageManager = usePreferredPackageManager();

  const selectedOption = options.find(
    (option) => option.packageManager === preferredPackageManager.value,
  );

  const copyToClipboard = () => {
    if (!selectedOption) {
      return;
    }
    navigator.clipboard.writeText(selectedOption.command);
    setCopyCount((p) => p + 1);
  };

  useEffect(() => {
    if (copyCount <= 0) {
      return;
    }
    setCopyIds((p) => [...p, copyCount]);
    setTimeout(() => {
      setCopyIds((p) => p.filter((el) => el !== copyCount));
    }, 1000);
  }, [copyCount]);

  return (
    <CodeBlock className={cn("p-0", className)} {...rest}>
      <Tabs value={preferredPackageManager.value} onValueChange={preferredPackageManager.setValue}>
        <div className="px-2 pt-2 flex items-center justify-between">
          <TabsList className="flex gap-2">
            {options.map((option) => (
              <TabsTrigger key={option.packageManager} value={option.packageManager}>
                <option.icon className="size-3.5" />
                {option.packageManager}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button size="icon" className="relative" variant="ghost" onClick={copyToClipboard}>
            {copyIds.map((copyId) => {
              const randomRot = seedrandom(copyId.toString())();
              const amplification = Math.min(20, copyId * 2);
              const rotation = Math.floor(randomRot * amplification - amplification / 2);
              const fontSize = Math.min(30, copyId + 14);

              return (
                <div
                  className="absolute right-0 float-away pointer-events-none font-geist font-normal"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    fontSize: `${fontSize}px`,
                  }}
                  key={copyId}
                >
                  Copied to clipboard!
                  {copyId > 1 && ` x${copyId}`}
                </div>
              );
            })}

            <CopyIcon />
          </Button>
        </div>
        <Separator />
        <div className="px-4 pt-2 pb-4">
          {options.map((option) => (
            <TabsContent key={option.packageManager} value={option.packageManager}>
              <code>{option.command}</code>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </CodeBlock>
  );
}

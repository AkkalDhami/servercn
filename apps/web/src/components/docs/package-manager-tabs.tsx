"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TerminalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getIconForPackageManager,
  getPackageManagerIcon
} from "@/components/docs/icons/language-icons";
import { CodeWrapper } from "@/components/docs/code-wrapper";
import { usePackageManager } from "@/store/use-package-manager";

const managers = {
  pnpm: (c: string) => `pnpm dlx ${c.replace("npx ", "")}`,
  npm: (c: string) => c,
  yarn: (c: string) => `yarn ${c.replace("npx ", "")}`,
  bun: (c: string) => `bunx --bun ${c.replace("npx ", "")}`
};

export type PackageManager = keyof typeof managers;

export default function PackageManagerTabs({
  command = ""
}: {
  command: string;
}) {
  const { pkgManager, setPkgManager } = usePackageManager();

  function onChangePackageManager(pkgManager: PackageManager) {
    setPkgManager(pkgManager);
  }

  return (
    <Tabs
      value={pkgManager}
      className={cn("bg-code my-6 rounded-lg sm:max-w-full")}>
      <TabsList className={cn("bg-transparent pt-3 pl-3")}>
        <TerminalIcon className="text-muted-foreground mr-3 size-6 pt-1" />
        {Object.keys(managers).map(m => {
          const Icon = getPackageManagerIcon(m as PackageManager);
          return (
            <TabsTrigger
              key={m}
              value={m}
              className={cn(
                "text-muted-foreground flex items-center gap-3 bg-transparent font-medium data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
              )}
              onClick={() => onChangePackageManager(m as PackageManager)}>
              {Icon && getIconForPackageManager(m as keyof typeof managers)}
              {m}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {Object.entries(managers).map(([key, transform]) => {
        const cmd = transform(command);
        const [bin, ...rest] = cmd.split(" ");
        const remaining = rest.join(" ");
        return (
          <TabsContent key={key} value={key}>
            <CodeWrapper code={cmd}>
              {/* <CodeBlock code={cmd} /> */}
              <pre className="overflow-x-auto overscroll-x-contain p-4">
                <code
                  data-slot="code-block"
                  data-language="bash"
                  className="font-code leading-none">
                  <span className="text-[#eb7520] dark:text-[#ffc799]">
                    {bin}
                  </span>{" "}
                  <span className="text-[#0e99d9] dark:text-[#52e1e3]">
                    {remaining}
                  </span>
                </code>
              </pre>
            </CodeWrapper>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

// function getColor()

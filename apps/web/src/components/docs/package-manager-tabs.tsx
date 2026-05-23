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
  const Icon = getPackageManagerIcon(pkgManager, "size-5");

  return (
    <Tabs
      value={pkgManager}
      className={cn(
        "bg-background border-edge my-6 rounded-lg border sm:max-w-210"
      )}>
      <TabsList className={cn("bg-transparent pt-1 pl-3")}>
        <div className="mr-4 flex items-center gap-3 pt-3">{Icon}</div>
        {Object.keys(managers).map(m => {
          return (
            <TabsTrigger
              key={m}
              value={m}
              className={cn(
                "text-muted-foreground flex items-center gap-3 bg-transparent text-base font-medium data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
              )}
              onClick={() => onChangePackageManager(m as PackageManager)}>
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
          <TabsContent key={key} value={key} className="border-edge border-t">
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

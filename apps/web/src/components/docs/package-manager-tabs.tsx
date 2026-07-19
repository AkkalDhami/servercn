"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  getPackageManagerIcon,
  PackageManagerType
} from "@/components/docs/icons/language-icons";
import { CodeWrapper } from "@/components/docs/code-wrapper";
import { usePackageManager } from "@/store/use-package-manager";
import { CodeBlock } from "./code-block";

const pkgManagers = ["npm", "yarn", "pnpm", "bun"];

export default function PackageManagerTabs({
  command = ""
}: {
  command: string;
}) {
  const { pkgManager, setPkgManager } = usePackageManager();

  function onChangePackageManager(pkgManager: PackageManagerType) {
    setPkgManager(pkgManager);
  }
  const Icon = getPackageManagerIcon(pkgManager, "size-5");

  return (
    <Tabs
      value={pkgManager}
      className={cn(
        "bg-background border-edge max-w-code mt-2 mb-4 rounded-lg border"
      )}>
      <TabsList className={cn("bg-transparent pt-1 pl-3")}>
        <div className="mr-4 flex items-center gap-3 pt-3">{Icon}</div>
        {pkgManagers.map(m => {
          return (
            <TabsTrigger
              key={m}
              value={m}
              className={cn(
                "text-muted-foreground flex items-center gap-3 bg-transparent text-base font-medium data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
              )}
              onClick={() => onChangePackageManager(m as PackageManagerType)}>
              {m}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {pkgManagers.map(key => {
        const commands = convertNpmCommand(command);
        const cmd = commands[key as PackageManagerType];
        return (
          <TabsContent key={key} value={key} className="border-edge border-t">
            <CodeWrapper code={cmd}>
              <CodeBlock code={cmd} className="[&_pre]:font-code" />
              {/* <pre className="overflow-x-auto overscroll-x-contain p-4">
                <code
                  data-theme="vesper github-light"
                  data-language="bash"
                  className="font-code leading-none">
                  <span>{cmd}</span>
                </code>
              </pre> */}
            </CodeWrapper>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

// Thanks https://chanhdai.com/components/code-block-command

type ConvertNpmCommandResult = {
  pnpm: string;
  yarn: string;
  npm: string;
  bun: string;
};

export function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  // npm install
  if (npmCommand.startsWith("npm install")) {
    return {
      pnpm: npmCommand.replaceAll("npm install", "pnpm add"),
      yarn: npmCommand.replaceAll("npm install", "yarn add"),
      npm: npmCommand,
      bun: npmCommand.replaceAll("npm install", "bun add")
    };
  }

  // npx create- (must be checked before generic npx)
  if (npmCommand.startsWith("npx create-")) {
    return {
      pnpm: npmCommand.replace("npx create-", "pnpm create "),
      yarn: npmCommand.replace("npx create-", "yarn create "),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun")
    };
  }

  // npm create
  if (npmCommand.startsWith("npm create")) {
    return {
      pnpm: npmCommand.replace("npm create", "pnpm create"),
      yarn: npmCommand.replace("npm create", "yarn create"),
      npm: npmCommand,
      bun: npmCommand.replace("npm create", "bun create")
    };
  }

  // npx (general)
  if (npmCommand.startsWith("npx")) {
    return {
      pnpm: npmCommand.replace("npx", "pnpm dlx"),
      yarn: npmCommand.replace("npx", "yarn dlx"),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun")
    };
  }

  // npm run
  if (npmCommand.startsWith("npm run")) {
    return {
      pnpm: npmCommand.replace("npm run", "pnpm"),
      yarn: npmCommand.replace("npm run", "yarn"),
      npm: npmCommand,
      bun: npmCommand.replace("npm run", "bun")
    };
  }

  return {
    pnpm: npmCommand,
    yarn: npmCommand,
    npm: npmCommand,
    bun: npmCommand
  };
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { CodeWrapper } from "./code-wrapper";
import { TerminalIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { CODE_THEME_BG_KEY } from "@/lib/constants";

const managers = {
  pnpm: (c: string) => `pnpm dlx ${c.replace("npx ", "")}`,
  npm: (c: string) => c,
  yarn: (c: string) => `yarn ${c.replace("npx ", "")}`,
  bun: (c: string) => `bunx --bun ${c.replace("npx ", "")}`
};

const managersIcons = {
  pnpm: "pnpm-logo.svg",
  npm: "npm-logo.png",
  yarn: "yarn-logo.png",
  bun: "bun-logo.svg"
};

export default async function PackageManagerTabs({
  command = ""
}: {
  command: string;
}) {
  const cookieStore = await cookies();
  const bg = cookieStore.get(CODE_THEME_BG_KEY)?.value || "#101010";

  return (
    <Tabs
      defaultValue="npm"
      className={cn(
        "xsm:max-w[340px] my-6 max-w-90 overflow-auto rounded-md border-0 sm:max-w-200"
      )}
      style={{ backgroundColor: bg }}>
      <TabsList className={cn("pl-3")} style={{ backgroundColor: bg }}>
        <TerminalIcon className="mr-4 size-5 text-neutral-400" />
        {Object.keys(managers).map(m => (
          <TabsTrigger
            key={m}
            value={m}
            className={cn(
              "flex items-center gap-2 font-medium text-neutral-400 data-[state=active]:text-black data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:text-white"
            )}
            style={{ backgroundColor: bg }}>
            <Image
              src={`/${managersIcons[m as keyof typeof managersIcons]}`}
              className={cn("hidden size-3.5 sm:block")}
              width={20}
              height={20}
              alt={m}
            />
            {m}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(managers).map(([key, transform]) => {
        const cmd = transform(command);

        return (
          <TabsContent key={key} value={key}>
            <CodeWrapper code={cmd}>
              <CodeBlock code={cmd} lang="bash" />
            </CodeWrapper>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

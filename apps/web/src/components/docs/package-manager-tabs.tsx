import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./code-block";
import { CodeWrapper } from "./code-wrapper";
import { TerminalIcon } from "lucide-react";

const managers = {
  pnpm: (c: string) => `pnpm dlx ${c.replace("npx ", "")}`,
  npm: (c: string) => c,
  yarn: (c: string) => `yarn ${c.replace("npx ", "")}`,
  bun: (c: string) => `bunx ${c.replace("npx ", "")}`,
};

export default function PackageManagerTabs({
  command = "",
}: {
  command: string;
}) {
  return (
    <Tabs
      defaultValue="npm"
      className="my-6 max-w-[900px] overflow-auto rounded-md bg-[#0b0e14] text-white"
    >
      <TabsList className="bg-[#0b0e14]">
        <TerminalIcon className="size-5 text-neutral-400" />
        {Object.keys(managers).map((m) => (
          <TabsTrigger
            key={m}
            value={m}
            className="font-medium text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-white dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-[#0b0e14]"
          >
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

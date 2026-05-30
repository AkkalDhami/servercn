"use client";

import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { Section } from "@/components/ui/section";
import { Terminal } from "@/components/ui/terminal";
import { cn } from "@/lib/utils";
import ComponentFileViewer from "../file-viewer";
export default function NextjsStarterSection() {
  return (
    <Section id="nextjs-starter-section" className="">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">Next.js Starter</Heading>
        <SubHeading className="text-muted-foreground mt-4">
          Servercn&apos;s Next.js Starter is a production-ready foundation with App
          Router, TypeScript, and Tailwind—so you can build immediately without
          boilerplate.
        </SubHeading>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <div className="col-span-2 h-full min-h-144">
          <Terminal
            command="npx servercn-cli init nextjs-starter --fw=nextjs"
            containerClassName={cn("min-h-144 h-full")}
            commands={["npx servercn-cli init nextjs-starter --fw=nextjs"]}
            outputs={{
              0: [
                "CREATE: tsconfig.json",
                "CREATE: postcss.config.mjs",
                "CREATE: package.json",
                "CREATE: next.config.ts",
                "CREATE: next-env.d.ts",
                "CREATE: eslint.config.mjs",
                "CREATE: commitlint.config.ts",
                "CREATE: CLAUDE.md",
                "CREATE: AGENTS.md",
                "CREATE: .prettierrc",
                "CREATE: .prettierignore",
                "CREATE: src/app/page.tsx",
                "CREATE: src/app/layout.tsx",
                "CREATE: src/app/globals.css",
                "✔ Successfully installed dependencies",
                "✔ Successfully installed devDependencies",
                "✔ Servercn initialized with 'foundation:nextjs-starter'",
                "Run the following commands:",
                "1. cd nextjs",
                "2. npm run dev"
              ]
            }}
            typingSpeed={45}
            delayBetweenCommands={1000}
          />
        </div>
        <div className="col-span-3">
          <ComponentFileViewer
            from="structure"
            slug={"nextjs-starter"}
            architecture={"file-api"}
            framework={"nextjs"}
            type={"foundation"}
          />
        </div>
      </div>
    </Section>
  );
}

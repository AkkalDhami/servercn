import { SiExpress, SiNestjs, SiNextdotjs } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import registryData from "@/data/registry.json";
import { IconType } from "react-icons/lib";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Route } from "next";
import { GITHUB_URL } from "@/lib/constants";
import { FrameworkType } from "@/@types/registry";

interface Framework {
  name: string;
  icon: IconType;
  status: "available" | "working" | "coming-soon";
  description: string;
  frameworks?: string[];
  githubLink?: string;
}

interface FrameworkStats {
  components: number;
  blueprints: number;
  foundations: number;
  schemas: number;
  providers: number;
}

const FRAMEWORKS: Framework[] = [
  {
    name: "Express.js",
    icon: SiExpress,
    status: "available",
    description:
      "The battle-tested Node.js framework. Full component support — auth, middleware, error handling, and more.",
    frameworks: ["express"]
  },
  {
    name: "NestJS",
    icon: SiNestjs,
    status: "coming-soon",
    description:
      "Enterprise-grade Node.js. Modular components for guards, interceptors, pipes — aligned with NestJS DI patterns.",
    frameworks: ["nestjs"],
    githubLink: GITHUB_URL
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    status: "working",
    description:
      "Full-stack ready. Route handlers, server actions, and middleware components for Next.js App Router backends",
    frameworks: ["nextjs"],
    githubLink: GITHUB_URL
  }
];

// Calculate stats for a given framework
export function calculateFrameworkStats(
  frameworkName: FrameworkType[]
): FrameworkStats {
  const items = registryData.items.filter(
    item =>
      item.frameworks && frameworkName.some(fw => item.frameworks?.includes(fw))
  );

  return {
    components: items.filter(
      item => item.type === "component" && item.status === "stable"
    ).length,
    blueprints: items.filter(
      item => item.type === "blueprint" && item.status === "stable"
    ).length,
    foundations: items.filter(
      item => item.type === "foundation" && item.status === "stable"
    ).length,
    schemas: items.filter(
      item => item.type === "schema" && item.status === "stable"
    ).length,
    providers: items.filter(
      item => item.type === "provider" && item.status === "stable"
    ).length
  };
}

export default function SupportedFrameworks() {
  return (
    <Section id="supported-frameworks" className="px-0">
      <div className="px-0">
        <div className="mb-8 text-center">
          <Heading className="text-3xl font-bold">Supported Frameworks</Heading>
          <SubHeading className="text-muted-foreground mt-4">
            Build your backend with your preferred framework. Start with
            Express.js, more coming soon.
          </SubHeading>
        </div>

        <div className="divide-edge border-edge screen-line-after grid grid-cols-1 divide-x border-l sm:grid-cols-3">
          {FRAMEWORKS.map(framework => {
            const Icon = framework.icon;
            const isAvailable = framework.status === "available";
            const isWorking = framework.status === "working";

            return (
              <div
                key={framework.name}
                className={cn(
                  "hover:bg-card-hover relative p-4 duration-300",
                  "border-edge last:border-r",
                  "screen-line-before",
                  "dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)]"
                )}>
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className="size-12" />
                    <Badge
                      className={
                        isAvailable
                          ? "border-green-500 bg-green-500/10 text-green-500 uppercase"
                          : isWorking
                            ? "border-blue-500 bg-blue-500/10 text-blue-600 uppercase"
                            : "border-yellow-500 bg-yellow-500/10 text-yellow-600 uppercase"
                      }>
                      {isAvailable
                        ? "Available"
                        : isWorking
                          ? "Working"
                          : "Coming Soon"}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-xl font-medium">{framework.name}</h3>
                  <p className="text-muted-foreground mt-1">
                    {framework.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

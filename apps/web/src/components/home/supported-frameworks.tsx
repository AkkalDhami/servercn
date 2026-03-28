import { SiExpress, SiNestjs, SiNextdotjs } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import registryData from "@/data/registry.json";
import { IconType } from "react-icons/lib";
import { Section } from "../ui/section";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Route } from "next";
import { GITHUB_URL } from "@/lib/constants";
import { FrameworkType } from "@/@types/registry";

interface Framework {
  name: string;
  icon: IconType;
  status: "available" | "coming-soon";
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
    frameworks: ["express"],
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
    status: "available",
    description:
      "Full-stack ready. Route handlers, server actions, and middleware components for Next.js App Router backends",
    frameworks: ["nextjs"],
    githubLink: GITHUB_URL
  }
];

// Calculate stats for a given framework
export function calculateFrameworkStats(frameworkName: FrameworkType[]): FrameworkStats {
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
    ).length,
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
            const stats = framework.frameworks
              ? calculateFrameworkStats(framework.frameworks as FrameworkType[])
              : null;

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
                          : "border-yellow-500 bg-yellow-500/10 text-yellow-600 uppercase"
                      }>
                      {isAvailable ? "Available" : "Coming Soon"}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-xl font-medium">{framework.name}</h3>
                  <p className="text-muted-foreground mt-1">
                    {framework.description}
                  </p>
                </div>
                {stats ? (
                  <div className="space-y-4">
                    {stats.components > 0 &&
                      stats.blueprints > 0 &&
                      stats.foundations > 0 &&
                      stats.schemas > 0 &&
                      stats.providers > 0 &&
                      (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                              {stats.components}+{" "}
                            </span>
                            Components
                          </p>
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                              {stats.blueprints}+{" "}
                            </span>
                            Blueprints
                          </p>
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                              {stats.providers}+{" "}
                            </span>
                            Providers
                          </p>
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                              {stats.foundations}+{" "}
                            </span>
                            Foundations
                          </p>
                          <p className="text-muted-foreground text-sm">
                            <span className="text-foreground font-bold">
                              {stats.schemas}+{" "}
                            </span>
                            Schemas
                          </p>
                        </div>
                      )}
                  </div>
                ) : null}

                {framework.githubLink && (
                  <div className="pt-4">
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <Link
                        href={framework.githubLink as Route}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FaGithub className="size-4" />
                        Contribute on GitHub
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

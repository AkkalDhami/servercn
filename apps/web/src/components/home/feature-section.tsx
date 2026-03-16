import {
  Blocks,
  Terminal,
  Code2,
  Settings,
  BookOpen,
  Package,
  Database,
  RefreshCw,
  FolderTree,
  ShieldCheck,
  Puzzle,
  Layers
} from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import React from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";

interface IFeature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  className?: string;
}

const features: IFeature[] = [
  {
    icon: Blocks,
    title: "Component-First Backend",
    description:
      "Backend features are treated like UI components—modular, reusable, and composed as your system grows.",
    className: "md:col-span-2"
  },
  {
    icon: Terminal,
    title: "CLI-First Workflow",
    description:
      "Initialize once, then add backend components through a predictable, developer-friendly CLI.",
    className: ""
  },
  {
    icon: Code2,
    title: "You Own the Code",
    description:
      "ServerCN copies code directly into your project. No runtime dependencies. No lock-in. No hidden fees."
  },
  {
    icon: Layers,
    title: "Architecture-Aware",
    description:
      "Components adapt naturally to MVC, feature-based without forcing a framework.",
    className: ""
  },
  {
    icon: Settings,
    title: "Opinionated, Yet Flexible",
    description:
      "Production-ready defaults that follow best practices while remaining fully customizable."
  },
  {
    icon: Puzzle,
    title: "Composable Components",
    description:
      "Add only what you need—auth, validation, hashing, errors—without coupling your entire stack.",
    className: "md:col-span-2"
  },
  {
    icon: ShieldCheck,
    title: "Production-Ready by Default",
    description:
      "Security-conscious implementations designed for real-world backend workloads."
  },
  {
    icon: FolderTree,
    title: "Convention-Driven Structure",
    description:
      "Consistent file structure and naming across components, improving readability and maintainability."
  },
  {
    icon: RefreshCw,
    title: "Non-Destructive Updates",
    description:
      "Existing files are respected—only missing pieces are added, never overwritten silently."
  },
  {
    icon: Database,
    title: "Database-Aware Setup",
    description:
      "Components integrate cleanly with MongoDB, PostgreSQL, MySQL, and other common databases."
  },
  {
    icon: Package,
    title: "Dependency-Safe Installs",
    description:
      "Dependencies are installed only when required and at the correct project scope.",
    className: "md:col-span-2"
  },
  {
    icon: BookOpen,
    title: "Transparent & Documented",
    description:
      "Every component ships with clear documentation, usage patterns, and integration guidance."
  }
];

export default function WhyServerCN() {
  return (
    <Section id="feature" className="px-0">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">Why ServerCN</Heading>
        <SubHeading className="text-muted-foreground mt-4">
          Everything you need to build a backend, without the boilerplate.
        </SubHeading>
      </div>

      <div className="divide-edge border-edge screen-line-after grid divide-x border-l sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {features.map((item: IFeature) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}

export function FeatureCard({ item }: { item: IFeature }) {
  return (
    <div
      key={item.title}
      className={cn(
        "hover:bg-card-hover relative p-4 duration-300",
        "border-edge last:border-r",
        "screen-line-before",
        item.className
      )}>
      <div className="relative">
        <item.icon className="text-muted-foreground size-10" />
        <h3 className="mt-4 font-semibold">{item.title}</h3>
        <p className="text-muted-primary mt-2 text-sm">{item.description}</p>
      </div>
    </div>
  );
}

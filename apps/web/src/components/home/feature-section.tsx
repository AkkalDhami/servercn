import { Blocks, Terminal, Code2, Settings, BookOpen, Package, Database, RefreshCw, FolderTree, ShieldCheck, Puzzle, Layers } from "lucide-react";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import React from "react";
import { cn } from "@/lib/utils";

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
    description: "Backend features are treated like UI components—modular, reusable, and composed as your system grows.",
    className: "md:col-span-2"
  },
  {
    icon: Terminal,
    title: "CLI-First Workflow",
    description: "Initialize once, then add backend components through a predictable, developer-friendly CLI.",
    className: ""
  },
  {
    icon: Code2,
    title: "You Own the Code",
    description: "ServerCN copies code directly into your project. No runtime dependencies. No lock-in. No hidden fees."
  },
  {
    icon: Layers,
    title: "Architecture-Aware",
    description: "Components adapt naturally to MVC, feature-based, or clean architecture without forcing a framework.",
    className: ""
  },
  {
    icon: Settings,
    title: "Opinionated, Yet Flexible",
    description: "Production-ready defaults that follow best practices while remaining fully customizable.",
    className: "md:col-span-2"
  },
  {
    icon: Puzzle,
    title: "Composable Components",
    description: "Add only what you need—auth, validation, hashing, errors—without coupling your entire stack."
  },
  {
    icon: ShieldCheck,
    title: "Production-Ready by Default",
    description: "Security-conscious implementations designed for real-world backend workloads."
  },
  {
    icon: FolderTree,
    title: "Convention-Driven Structure",
    description: "Consistent file structure and naming across components, improving readability and maintainability."
  },
  {
    icon: RefreshCw,
    title: "Non-Destructive Updates",
    description: "Existing files are respected—only missing pieces are added, never overwritten silently.",
    className: "md:col-span-2"
  },
  {
    icon: Database,
    title: "Database-Aware Setup",
    description: "Components integrate cleanly with MongoDB, PostgreSQL, MySQL, and other common databases.",
    className: "md:col-span-2"
  },
  {
    icon: Package,
    title: "Dependency-Safe Installs",
    description: "Dependencies are installed only when required and at the correct project scope."
  },
  {
    icon: BookOpen,
    title: "Transparent & Documented",
    description: "Every component ships with clear documentation, usage patterns, and integration guidance."
  }
];

export default function WhyServerCN() {
  return (
    <section id="feature" className="py-20">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">Why ServerCN</Heading>
        <SubHeading className="text-muted-foreground mt-4">Everything you need to build a backend, without the boilerplate.</SubHeading>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((item: IFeature) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

export function FeatureCard({ item }: { item: IFeature }) {
  return (
    <div key={item.title} className={cn("hover:bg-card-hover bg-background border-hover relative rounded-xl border p-6", item.className)}>
      <div aria-hidden className="absolute inset-0 isolate z-0 opacity-50 contain-strict dark:opacity-100">
        <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
      </div>
      <div className="relative">
        <item.icon className="text-muted-foreground size-10" />
        <h3 className="mt-4 font-semibold">{item.title}</h3>
        <p className="text-muted-primary mt-2 text-sm">{item.description}</p>
      </div>
    </div>
  );
}

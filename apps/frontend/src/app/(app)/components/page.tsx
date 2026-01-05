import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import Link from "next/link";

import registry from "@/data/registry.json";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";

export const generateMetadata = (): Metadata => {
  return {
    title: "Components",
  };
};

interface BackendComponent {
  slug: string;
  title: string;
  description: string;
  type: "component" | "plugin";
  status: "stable" | "beta" | "experimental";
  docs: string;
}

const components = registry.items
  .filter((component) => component.type === "component")
  .sort((a, b) => a.title.localeCompare(b.title)) as BackendComponent[];

export default function ComponentsPage() {
  return (
    <Container className="mt-16 max-w-360 w-full min-h-screen">
      <div className="mb-6">
        <Heading className="tracking-tight">Backend Components</Heading>
        <SubHeading className="mt-2 mx-0 text-muted-foreground">
          Production-ready ServerCN components for building scalable backends.
          Here you can find all the components available in the library. We are
          working on adding more components.
        </SubHeading>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <ComponentCard key={component.slug} component={component} />
        ))}
      </div>
    </Container>
  );
}

function ComponentCard({ component }: { component: BackendComponent }) {
  return (
    <Link
      href={component.docs}
      className="group relative rounded-xl border bg-background p-5 border-hover hover:bg-card-hover">
      {component.status !== "stable" && (
        <span
          className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-medium border border-amber-400 dark:border-amber-600 bg-amber-500/10 text-amber-600
                `}>
          {component.status}
        </span>
      )}
      <h3 className="text-lg font-medium">{component.title}</h3>

      <p className="mt-2 text-sm text-muted-primary line-clamp-2">
        {component.description}
      </p>

      <div className="mt-4 flex items-center text-sm font-medium text-muted-secondary group-hover:underline group-hover:text-foreground duration-300">
        View docs
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

import registry from "@/data/registry.json";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";

export const generateMetadata = (): Metadata => {
  return {
    title: "Components",
  };
};

export interface BackendComponent {
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
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight">ServerCN Components</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
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
      {/* verwsion details and totoal components count */}
      <div className="mt-6 flex items-center justify-end">
        <p className="text-muted-foreground text-sm">
          Version: {registry.version.version} | Total components:{" "}
          {components.length} | Last updated: {registry.version.lastUpdated}
        </p>
      </div>
    </Container>
  );
}


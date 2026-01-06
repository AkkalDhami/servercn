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
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight">Backend Components</Heading>
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

function ComponentCard({ component }: { component: BackendComponent }) {
  return (
    <Link
      href={component.docs}
      className="group bg-background border-hover hover:bg-card-hover relative rounded-xl border p-5"
    >
      {component.status !== "stable" && (
        <span
          className={`absolute top-4 right-4 rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:border-amber-600`}
        >
          {component.status}
        </span>
      )}
      <h3 className="text-lg font-medium">{component.title}</h3>

      <p className="text-muted-primary mt-2 line-clamp-2 text-sm">
        {component.description}
      </p>

      <div className="text-muted-secondary group-hover:text-foreground mt-4 flex items-center text-sm font-medium duration-300 group-hover:underline">
        View docs
      </div>
    </Link>
  );
}

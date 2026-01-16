import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

import registry from "@/data/registry.json";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";
import { IRegistryItems } from "@/@types/registry";

export const generateMetadata = (): Metadata => {
  return {
    title: "Blueprints",
    description:
      "Production-ready ServerCN blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.",
    keywords: ["ServerCN", "Blueprints", "ServerCN Blueprints", "ServerCN Blueprints for building scalable backends"],
    openGraph: {
      title: "Blueprints",
      description:
        "Production-ready ServerCN blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.",
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Blueprints",
      description:
        "Production-ready ServerCN blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.",
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

const blueprints = registry.items
  .filter(component => component.type === "blueprint")
  .sort((a, b) => a.title.localeCompare(b.title)) as IRegistryItems[];

export default function BlueprintsPage() {
  return (
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight">ServerCN Blueprints</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready ServerCN blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are
          working on adding more blueprints.
        </SubHeading>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blueprints.map(component => (
          <ComponentCard key={component.slug} component={component} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <p className="text-muted-foreground text-sm">
          Version: {registry.version.version} | Total blueprints: {blueprints.length}
        </p>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";

export const generateMetadata = (): Metadata => {
  return {
    title: "Blueprints",
    description: `Production-ready ${APP_NAME} blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.`,
    keywords: [
      `${APP_NAME}`,
      "Blueprints",
      `${APP_NAME} Blueprints`,
      `${APP_NAME} Blueprints for building scalable backends`
    ],
    openGraph: {
      title: "Blueprints",
      description:
        `Production-ready ${APP_NAME} blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Blueprints",
      description:
        `Production-ready ${APP_NAME} blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

const blueprints = getRegistryTypeItems("blueprint", "express");

export default function BlueprintsPage() {
  return (
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight capitalize">{APP_NAME} Blueprints</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} blueprints for building scalable backends.
          Here you can find all the blueprints available in the library. We are
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
          Total blueprints: {blueprints.length}
        </p>
      </div>
    </Container>
  );
}

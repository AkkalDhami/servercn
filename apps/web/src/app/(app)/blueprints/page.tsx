import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import { APP_NAME } from "@/lib/constants";
import { SelectFramework } from "@/components/docs/select-framework";
import { ComponentsCatalog } from "@/components/docs/components-catalog";

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
      description: `Production-ready ${APP_NAME} blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Blueprints",
      description: `Production-ready ${APP_NAME} blueprints for building scalable backends. Here you can find all the blueprints available in the library. We are working on adding more blueprints.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

export default function BlueprintsPage() {
  return (
    <Container className="border-edge border-x px-0 pt-16">
      <div className="dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] mb-6 flex flex-wrap justify-between gap-4 px-4 pt-2">
        <div>
          <Heading className="tracking-tight capitalize">
            {APP_NAME} Blueprints
          </Heading>
          <SubHeading className="text-muted-foreground mx-0 mt-2">
            Production-ready {APP_NAME} blueprints for building scalable
            backends. Here you can find all the blueprints available in the
            library. We are working on adding more blueprints.
          </SubHeading>
        </div>
        <div className="mt-4 w-full max-w-xs">
          <SelectFramework mode="store-only" />
        </div>
      </div>
      <ComponentsCatalog type="blueprint" />
    </Container>
  );
}

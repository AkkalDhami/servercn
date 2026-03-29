import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import type { Metadata } from "next";

import { APP_NAME } from "@/lib/constants";
import { SelectFramework } from "@/components/docs/select-framework";
import { ComponentsCatalog } from "@/components/docs/components-catalog";

export const generateMetadata = (): Metadata => {
  return {
    title: "Schemas",
    description: `Production-ready ${APP_NAME} schemas for building scalable backends. Here you can find all the schemas available in the library. We are working on adding more schemas.`,
    keywords: [
      `${APP_NAME}`,
      "Schemas",
      `${APP_NAME} Schemas`,
      `${APP_NAME} Schemas for building scalable backends`
    ],
    openGraph: {
      title: "Schemas",
      description: `Production-ready ${APP_NAME} schemas for building scalable backends. Here you can find all the schemas available in the library. We are working on adding more schemas.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Schemas",
      description: `Production-ready ${APP_NAME} schemas for building scalable backends. Here you can find all the schemas available in the library. We are working on adding more schemas.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

export default function SchemaPage() {
  return (
    <Container className="border-edge border-x px-0 pt-16">
      <div className="dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] mb-6 flex flex-wrap justify-between gap-4 px-4 pt-2">
        <div>
          <Heading className="tracking-tight capitalize">
            {APP_NAME} Schemas
          </Heading>
          <SubHeading className="text-muted-foreground mx-0 mt-2">
            Production-ready {APP_NAME} schemas for building scalable backends.
            Here you can find all the schemas available in the library. We are
            working on adding more schemas.
          </SubHeading>
        </div>
        <div className="mt-4 w-full max-w-xs">
          <SelectFramework mode="store-only" />
        </div>
      </div>

      <ComponentsCatalog type="schema" />
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import { ComponentsCatalog } from "@/components/docs/components-catalog";
import { APP_NAME } from "@/lib/constants";
import { SelectFramework } from "@/components/docs/select-framework";

export const generateMetadata = (): Metadata => {
  return {
    title: "Components",
    description: `Production-ready ${APP_NAME} components for building scalable backends. Here you can find all the components available in the library. We are working on adding more components.`,
    keywords: [
      `${APP_NAME}`,
      "Components",
      `${APP_NAME} Components`,
      `${APP_NAME} Components for building scalable backends`
    ],
    openGraph: {
      title: "Components",
      description: `Production-ready ${APP_NAME} components for building scalable backends. Here you can find all the components available in the library. We are working on adding more components.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Components",
      description: `Production-ready ${APP_NAME} components for building scalable backends. Here you can find all the components available in the library. We are working on adding more components.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

export default function ComponentsPage() {
  return (
    <Container className="border-edge border-x px-0 pt-16">
      <div className="dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] mb-6 px-4 pt-2 flex justify-between flex-wrap gap-4">
        <div >
          <Heading className="tracking-tight capitalize">
            {APP_NAME} Components
          </Heading>
          <SubHeading className="text-muted-foreground mx-0 mt-2">
            Production-ready {APP_NAME} components for building scalable backends.
            Here you can find all the components available in the library. We are
            working on adding more components.
          </SubHeading>
        </div>

        <div className="w-full max-w-xs mt-4">
          <SelectFramework mode="store-only" />
        </div>
      </div>

      <ComponentsCatalog type="component" />
    </Container>
  );
}

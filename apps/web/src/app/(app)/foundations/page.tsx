import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import { APP_NAME } from "@/lib/constants";
import { SelectFramework } from "@/components/docs/select-framework";
import { ComponentsCatalog } from "@/components/docs/components-catalog";

export const generateMetadata = (): Metadata => {
  return {
    title: "Foundations",
    description: `Production-ready ${APP_NAME} foundations for building scalable backends. Here you can find all the foundations available in the library. We are working on adding more foundations.`,
    keywords: [
      `${APP_NAME}`,
      "Foundations",
      `${APP_NAME} Foundations`,
      `${APP_NAME} Foundations for building scalable backends`
    ],
    openGraph: {
      title: "Foundations",
      description: `Production-ready ${APP_NAME} foundations for building scalable backends. Here you can find all the foundations available in the library. We are working on adding more foundations.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Foundations",
      description: `Production-ready ${APP_NAME} foundations for building scalable backends. Here you can find all the foundations available in the library. We are working on adding more foundations.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

export default function FoundationsPage() {
  return (
    <Container className="border-edge w-full max-w-360 border-x px-0 pt-16">
      <div className="dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] flex justify-between flex-wrap mb-6 px-4 pt-2">
        <div>
          <Heading className="tracking-tight capitalize">
            {APP_NAME} Foundations
          </Heading>
          <SubHeading className="text-muted-foreground mx-0 mt-2">
            Production-ready {APP_NAME} foundations for building scalable
            backends. Here you can find all the foundations available in the
            library. We are working on adding more foundations.
          </SubHeading>
        </div>

        <div className="w-full max-w-xs mt-4">
          <SelectFramework mode="store-only" />
        </div>
      </div>

      <ComponentsCatalog type="foundation" />
    </Container>
  );
}

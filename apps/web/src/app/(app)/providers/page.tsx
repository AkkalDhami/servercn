import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import { APP_NAME } from "@/lib/constants";
import { SelectFramework } from "@/components/docs/select-framework";
import { ComponentsCatalog } from "@/components/docs/components-catalog";

export const generateMetadata = (): Metadata => {
  return {
    title: "Providers",
    description: `Production-ready ${APP_NAME} providers for building scalable backends. Here you can find all the providers available in the library. We are working on adding more providers.`,
    keywords: [
      `${APP_NAME}`,
      "Providers",
      `${APP_NAME} Providers`,
      `${APP_NAME} Providers for building scalable backends`
    ],
    openGraph: {
      title: "Providers",
      description: `Production-ready ${APP_NAME} providers for building scalable backends. Here you can find all the providers available in the library. We are working on adding more providers.`,
      type: "website",
      locale: "en"
    },
    twitter: {
      title: "Providers",
      description: `Production-ready ${APP_NAME} providers for building scalable backends. Here you can find all the providers available in the library. We are working on adding more providers.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

export default function ProvidersPage() {
  return (
    <Container className="border-edge border-x px-0 pt-16">
      <div className="my-4 flex flex-wrap justify-between gap-4 px-4">
        <div>
          <Heading className="tracking-tight capitalize">
            {APP_NAME} Providers
          </Heading>
          <SubHeading className="text-muted-foreground mx-0 mt-2">
            Production-ready {APP_NAME} providers for building scalable
            backends. Here you can find all the providers available in the
            library. We are working on adding more providers.
          </SubHeading>
        </div>
        <div className="mt-4 w-full max-w-xs">
          <SelectFramework mode="store-only" />
        </div>
      </div>

      <ComponentsCatalog type="provider" />
    </Container>
  );
}

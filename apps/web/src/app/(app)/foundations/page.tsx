import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";

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

const foundations = getRegistryTypeItems("foundation", "express");

export default function FoundationsPage() {
  return (
    <Container className="border-edge w-full max-w-360 border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight capitalize">
          {APP_NAME} Foundations
        </Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} foundations for building scalable
          backends. Here you can find all the foundations available in the
          library. We are working on adding more foundations.
        </SubHeading>
      </div>

      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {foundations.map(component => (
          <ComponentCard key={component.slug} component={component} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground text-base">
          Total foundations: {foundations.length}
        </p>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";

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
const components = getRegistryTypeItems("component", "express");

const stableComponents = components.filter(
  component => component.status === "stable"
);

export default function ComponentsPage() {
  return (
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight capitalize">
          {APP_NAME} Components
        </Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} components for building scalable backends.
          Here you can find all the components available in the library. We are
          working on adding more components.
        </SubHeading>
      </div>

      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {components.map(component => (
          <ComponentCard key={component.slug} component={component} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground">
          Total components: {components.length} | Stable components:{" "}
          {stableComponents.length}
        </p>
      </div>
    </Container>
  );
}

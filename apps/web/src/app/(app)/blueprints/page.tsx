import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";
import { ItemWithDBCard } from "../schemas/page";

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

const blueprints = getRegistryTypeItems("blueprint", "express");

export default function BlueprintsPage() {
  return (
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight capitalize">
          {APP_NAME} Blueprints
        </Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} blueprints for building scalable backends.
          Here you can find all the blueprints available in the library. We are
          working on adding more blueprints.
        </SubHeading>
      </div>

      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {blueprints.map(component => (
          <ItemWithDBCard key={component.slug} item={component} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground">
          Total blueprints: {blueprints.length}
        </p>
      </div>
    </Container>
  );
}

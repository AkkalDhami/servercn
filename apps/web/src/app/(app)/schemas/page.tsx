import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";

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
      description: `Production-ready ${APP_NAME } schemas for building scalable backends. Here you can find all the schemas available in the library. We are working on adding more schemas.`,
      card: "summary_large_image"
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
};

const schemas = getRegistryTypeItems("schema", "express");
export default function SchemaPage() {
  return (
    <Container className="mt-16 min-h-screen">
      <div className="mb-6">
        <Heading className="tracking-tight capitalize">{APP_NAME} Schemas</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} schemas for building scalable backends. Here
          you can find all the schemas available in the library. We are working
          on adding more schemas.
        </SubHeading>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schemas.map(component => {
          return (
            <div key={component.slug} className="flex flex-col gap-2">
              <Link
                href={`${component.url}` as Route}
                className="text-lg font-medium duration-300 hover:underline sm:text-xl">
                {component.title}
              </Link>
              <p className="text-muted-primary mt-2 line-clamp-2 text-base">
                {component.description}
              </p>

              {component.meta?.databases && (
                <ul className="mt-2 space-y-3 pl-1">
                  {component.meta.databases.map((database, index) => {
                    const modelPath = `/docs/${database.slug}`;
                    return (
                      <li key={database.slug}>
                        <Link
                          href={modelPath as Route}
                          className={cn(
                            "relative block capitalize underline underline-offset-2 transition-colors",
                            "text-muted-secondary hover:text-primary",
                            "font-medium"
                          )}>
                          {index + 1}. {database.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <p className="text-muted-foreground text-sm">
          Total schemas: {schemas.length}
        </p>
      </div>
    </Container>
  );
}

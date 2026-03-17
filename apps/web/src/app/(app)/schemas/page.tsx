import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";
import { IRegistryItems } from "@/@types/registry";

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

const schemas = getRegistryTypeItems("schema", "express");
export default function SchemaPage() {
  return (
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight capitalize">
          {APP_NAME} Schemas
        </Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} schemas for building scalable backends.
          Here you can find all the schemas available in the library. We are
          working on adding more schemas.
        </SubHeading>
      </div>

      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {schemas.map(component => {
          return <ItemWithDBCard key={component.slug} item={component} />;
        })}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground text-base">
          Total schemas: {schemas.length}
        </p>
      </div>
    </Container>
  );
}

export function ItemWithDBCard({ item }: { item: IRegistryItems }) {
  return (
    <div
      className={cn(
        "hover:bg-card-hover screen-line-before border-edge flex flex-col gap-2 p-4 duration-300 last:border-r",
        item.status !== "stable" && "pointer-events-none"
      )}>
      <Link
        href={(item.status === "stable" ? item.url : "") as Route}
        className="flex items-center gap-3 text-lg duration-300 hover:underline">
        {item.title}

        {item.status !== "stable" && (
          <>
            <span
              className={`absolute top-4 right-4 hidden rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 md:block dark:border-amber-600`}>
              upcoming
            </span>
            <span
              className={`absolute top-4 right-4 block size-2 rounded-full bg-amber-500 md:hidden`}></span>
          </>
        )}
        {item.meta?.new && (
          <span className={`size-2 rounded-full bg-blue-500`} />
        )}
      </Link>
      <p className="text-muted-primary line-clamp-2 text-base">
        {item.description}
      </p>

      {item.meta?.databases && (
        <ul className="space-y-3 pl-1">
          {item.meta.databases.map((database, index) => {
            const modelPath = `/docs/${database.slug}`;
            return (
              <li key={database.slug}>
                <Link
                  href={modelPath as Route}
                  className={cn(
                    "relative flex items-center gap-3 capitalize underline underline-offset-2 transition-colors",
                    "text-muted-secondary hover:text-primary"
                  )}>
                  {index + 1}. {database.label}
                  {database?.new && (
                    <span className={`size-2 rounded-full bg-blue-500`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="text-muted-primary mt-2 flex items-center text-sm font-medium">
        {item?.frameworks?.map((framework: string) => framework).join(" | ")}
      </div>
    </div>
  );
}

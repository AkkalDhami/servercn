import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SubHeading } from "@/components/ui/sub-heading";
import { Heading } from "@/components/ui/heading";
import ComponentCard from "@/components/docs/component-card";
import { getRegistryTypeItems } from "@/lib/source";
import { APP_NAME } from "@/lib/constants";

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
const providers = getRegistryTypeItems("provider", "express");

export default function ProvidersPage() {
  return (
    <Container className="border-edge border-x px-0 pt-16">
      <div className="dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] mb-6 px-4 pt-2">
        <Heading className="tracking-tight capitalize">
          {APP_NAME} Providers
        </Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Production-ready {APP_NAME} providers for building scalable backends.
          Here you can find all the providers available in the library. We are
          working on adding more providers.
        </SubHeading>
      </div>

      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {providers.map(p => (
          <ComponentCard key={p.slug} component={p} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground">
          Total providers: {providers.length}
        </p>
      </div>
    </Container>
  );
}

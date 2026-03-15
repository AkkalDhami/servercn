import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { APP_NAME } from "@/lib/constants";
import { contributingGuides } from "@/lib/contributing";
import { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Contributing to ${APP_NAME}`,
  description: `Learn how to contribute to ${APP_NAME} by adding components, blueprints, foundations, schemas, and tooling.`
};

export default function ContributingPage() {
  return (
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight">Contributing to {APP_NAME}</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Help us build the future of backend development. Choose a contribution
          type below to get started.
        </SubHeading>
      </div>

      <div className="screen-line-after divide-edge grid divide-x md:grid-cols-2 lg:grid-cols-3">
        {contributingGuides.map(guide => (
          <Link
            key={guide.title}
            href={guide.docs as Route}
            className="group screen-line-before border-hover hover:bg-card-hover border-edge relative p-4 last:border-r">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium underline-offset-4 group-hover:underline">
                {guide.title}
              </h3>
              {guide.meta?.new && (
                <span className={`size-2 rounded-full bg-blue-500`} />
              )}
            </div>

            <p className="text-muted-primary mt-2 line-clamp-4 text-sm">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}

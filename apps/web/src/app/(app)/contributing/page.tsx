
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { contributingGuides } from "@/lib/contributing";
import { Metadata, Route } from "next";
import Link from "next/link";

export const metadata:Metadata = {
  title: "Contributing to ServerCN",
  description: "Learn how to contribute to ServerCN by adding components, blueprints, foundations, schemas, and tooling.",
};


export default function ContributingPage() {
  return (
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight">Contributing to ServerCN</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Help us build the future of backend development. Choose a contribution
          type below to get started.
        </SubHeading>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contributingGuides.map(guide => (
            <Link
                key={guide.title}
               href={guide.docs as Route}
               className="group bg-background border-hover hover:bg-card-hover relative rounded-xl border p-5">
           
               <h3 className="text-lg font-medium">{guide.title}</h3>
         
               <p className="text-muted-primary mt-2 line-clamp-4 text-sm">
                 {guide.description}
               </p>
         
               <div className="text-muted-secondary group-hover:text-foreground mt-4 flex items-center text-sm font-medium duration-300 group-hover:underline">
                 View docs
               </div>
             </Link>
        ))}
      </div>
    </Container>
  );
}

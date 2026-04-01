import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { IContributor } from "@/app/(app)/contributors/page";
import { ContributorCard } from "../contributor/contributor-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/constants";
import { FaGithub } from "react-icons/fa6";

export default async function ContributorCta() {
  let contributors: IContributor[] = [];
  try {
    const data = await fetch(
      "https://api.github.com/repos/AkkalDhami/servercn/contributors"
    );

    if (data.ok) {
      const json = await data.json();
      contributors = Array.isArray(json) ? json : [];
    }
  } catch {
    contributors = [];
  }
  return (
    <Section id="contributor-cta" className="hidden md:block">
      <div className="mb-8 text-center">
        <Heading className="text-3xl font-bold">
          Open Source Contributors
        </Heading>
        <SubHeading className="text-muted-foreground mt-4">
          Servercn is actively maintained by contributors who bring
          production-grade patterns and improvements to the ecosystem.
        </SubHeading>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 p-4">
        {contributors.map(contributor => (
          <ContributorCard
            minimal={true}
            key={contributor.id}
            contributor={contributor as IContributor}
          />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <Button asChild className="primary-ring gap-2">
          <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <FaGithub size={16} />
            Become a contributor
          </Link>
        </Button>
      </div>
    </Section>
  );
}

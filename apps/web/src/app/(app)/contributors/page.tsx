import { ContributorCard } from "@/components/contributor/contributor-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { GITHUB_URL } from "@/lib/constants";

import { Metadata } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

export const metadata: Metadata = {
  title: `Contributors`,
  description: "Meet the contributors who worked on this project."
};

export interface IContributor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: "User";
  user_view_type: "public";
  site_admin: boolean;
  contributions: number;
}

export default async function Page() {
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
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mb-6 px-4">
        <Heading className="tracking-tight">Our Contributors</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Meet the contributors who worked on this project.
        </SubHeading>
      </div>
      <h1 className="mb-6 px-4 text-center text-3xl font-bold"></h1>
      <div className="screen-line-after grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <>
          {contributors.map(contributor => (
            <ContributorCard key={contributor.id} contributor={contributor} />
          ))}
        </>
        {contributors.length === 0 && (
          <div className="col-span-12 flex items-center justify-center">
            <p className="text-muted-foreground">
              No contributors found. Be the first to contribute!
            </p>
          </div>
        )}
      </div>
      <div className="screen-line-after flex flex-col items-center justify-center space-y-4 p-4">
        <p className="text-muted-foreground text-xl">
          This project is open-source and welcomes contributions from the
          community. Help improve features, fix bugs, or enhance documentation.
        </p>
        <Button asChild>
          <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <FaGithub size={16} />
            Contribute on GitHub
          </Link>
        </Button>
      </div>
      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground">
          Total contributors: {contributors.length}
        </p>
      </div>
    </Container>
  );
}

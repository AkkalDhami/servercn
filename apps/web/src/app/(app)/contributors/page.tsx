import { ContributorCard } from "@/components/contributor/contributor-card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ServerCN Contributors",
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
    <Container className="mt-16 min-h-screen w-full max-w-360">
      <div className="mb-6">
        <Heading className="tracking-tight">Our Contributors</Heading>
        <SubHeading className="text-muted-foreground mx-0 mt-2">
          Meet the contributors who worked on this project.
        </SubHeading>
      </div>
      <h1 className="mb-6 text-center text-3xl font-bold"></h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {contributors.map(contributor => (
          <ContributorCard key={contributor.id} contributor={contributor} />
        ))}
      </div>
    </Container>
  );
}

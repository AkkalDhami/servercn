import React from "react";
import { IContributor } from "@/app/(app)/contributors/page";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import { Route } from "next";
import Link from "next/link";
import { GitCommit, Award, Flame, Crown } from "lucide-react";
import { IconType } from "react-icons/lib";

export type BadgeTier =
  | "none"
  | "contributor"
  | "collaborator"
  | "maintainer"
  | "core";
interface ContributorCardProps {
  contributor: IContributor;
}

export function getContributionBadge(contributions: number): {
  Icon: IconType;
} {
  if (contributions >= 300) {
    return { Icon: Crown };
  }

  if (contributions >= 100) {
    return { Icon: Award };
  }

  if (contributions >= 50) {
    return { Icon: Flame };
  }

  if (contributions >= 1) {
    return { Icon: GitCommit };
  }

  return { Icon: GitCommit };
}

export const ContributorCard: React.FC<ContributorCardProps> = ({
  contributor
}) => {
  const badge = getContributionBadge(contributor.contributions);
  return (
    <div className="border-hover border-edge screen-line-before flex flex-col items-center border-x p-4 duration-300">
      <img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="mb-4 rounded-md"
      />
      <h3 className="text-lg font-semibold">{contributor.login}</h3>

      <div className="text-muted-primary flex items-center gap-1 text-sm font-medium">
        <badge.Icon className="size-4" />
        Contributions: {contributor.contributions}
      </div>

      <Button asChild className="mt-3 flex w-full items-center gap-3">
        <Link href={contributor.html_url as Route} target="_blank">
          <FaGithub /> Github Profile
        </Link>
      </Button>
    </div>
  );
};

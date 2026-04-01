import { IContributor } from "@/app/(app)/contributors/page";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import { Route } from "next";
import Link from "next/link";
import { GitCommit, Award, Flame, Crown } from "lucide-react";
import { IconType } from "react-icons/lib";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
export type BadgeTier =
  | "none"
  | "contributor"
  | "collaborator"
  | "maintainer"
  | "core";
interface ContributorCardProps {
  contributor: IContributor;
  minimal?: boolean;
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
  contributor,
  minimal = false
}) => {
  const badge = getContributionBadge(contributor.contributions);
  if (minimal) {
    return (
      <Link
        href={contributor.html_url as Route}
        target="_blank">
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="primary-ring mb-4 size-26 rounded-full object-cover"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-base font-medium">{contributor.login}</p>
            <p className="text-muted text-sm">
              Contributions: {contributor.contributions}
            </p>
          </TooltipContent>
        </Tooltip>
      </Link>
    );
  }
  return (
    <div className="hover:bg-card-hover screen-line-before dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] flex flex-col items-center p-4 duration-300 last:border-r">
      <img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="mb-4 h-[70%] w-full rounded-md object-cover"
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

"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export type FrameworkType = "express" | "nestjs" | null;

export type ArchType = "mvc" | "feature" | "modular";

const ARCHS_BY_FRAMEWORK: Record<NonNullable<FrameworkType>, ArchType[]> = {
  express: ["mvc", "feature"],
  nestjs: ["modular"]
};

const archNaming: Record<ArchType, string> = {
  mvc: "Model-View-Controller (MVC)",
  feature: "Feature-Based (Module, Shared)",
  modular: "Modular (NestJS)"
};

export default function ArchitectureTabs({
  current,
  framework,
  className
}: {
  current: string;
  framework?: FrameworkType;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine available architectures based on framework
  const availableArchs: ArchType[] = framework
    ? ARCHS_BY_FRAMEWORK[framework] || ["mvc", "feature"]
    : ["mvc", "feature"];

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("arch", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  // If only one architecture available, don't show tabs
  if (availableArchs.length === 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background text-muted-primary my-6 w-full overflow-auto rounded-md border sm:max-w-200",
        className
      )}>
      <div
        className={cn(
          "bg-background grid gap-3",
          availableArchs.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
        {availableArchs.map(arch => (
          <button
            key={arch}
            onClick={() => onChange(arch)}
            className={cn(
              "hover:bg-card-hover dark:hover:bg-card-hover hover:text-accent-foreground text-muted-primary dark:bg-background bg-background w-full cursor-pointer border-neutral-500/40 px-2 py-2 font-medium shadow-none dark:border-neutral-500/40",
              current === arch &&
                "bg-card-hover dark:bg-card-hover text-accent-foreground"
            )}>
            {archNaming[arch] || arch.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

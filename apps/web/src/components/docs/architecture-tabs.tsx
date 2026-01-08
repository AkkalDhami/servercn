"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const ARCHS = ["mvc", "feature"] as const;

const archNaming = {
  mvc: "Model-View-Controller (MVC)",
  feature: "Feature-Based (Feature)",
};

export default function ArchitectureTabs({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(current);

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("arch", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="bg-background text-muted-primary my-6 max-w-[800px] overflow-auto w-full rounded-md border">
      <div className="bg-background grid grid-cols-2 gap-3">
        {ARCHS.map((arch) => (
          <button
            key={arch}
            onClick={() => onChange(arch)}
            className={cn(
              "hover:bg-card-hover dark:hover:bg-card-hover hover:text-accent-foreground text-muted-primary dark:bg-background w-full cursor-pointer border-neutral-500/40 bg-transparent px-2 py-2 font-medium shadow-none dark:border-neutral-500/40",
              current === arch &&
                "bg-card-hover dark:bg-card-hover text-accent-foreground",
            )}
          >
            {archNaming[arch] || arch.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

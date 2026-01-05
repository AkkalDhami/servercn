"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

const ARCHS = ["mvc", "feature"] as const;

const archNaming = {
  mvc: "Model-View-Controller (MVC)",
  feature: "Feature-Based (Feature)",
};

export default function ArchitectureTabs({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("arch", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs
      value={current}
      onValueChange={onChange}
      className="my-6 bg-background border w-full text-muted-primary rounded-md">
      <TabsList className="bg-background w-full grid grid-cols-2 gap-2">
        {ARCHS.map((arch) => (
          <TabsTrigger
            key={arch}
            value={arch}
            className="data-[state=active]:bg-transparent w-full data-[state=active]:shadow-none data-[state=active]:border-neutral-500/40 dark:data-[state=active]:border-neutral-500/40 font-medium data-[state=active]:text-accent-foreground hover:bg-card-hover text-muted-primary dark:data-[state=active]:bg-background">
            {archNaming[arch] || arch.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

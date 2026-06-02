"use client";

import { getRegistryVariants } from "@/lib/source";
import { cn } from "@/lib/utils";
import { useFramework } from "@/store/use-framework";
import { useVariant } from "@/store/use-variant";

export function Variant({ name }: { name: string }) {
  const { variant, setVariant } = useVariant();
  const { framework } = useFramework();
  const variants = getRegistryVariants(name, framework);

  return (
    variants.length > 0 && (
      <div className="text-muted-foreground max-w-code mb-3 flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg border p-2 sm:gap-1">
        {variants.map((v, i) => (
          <div
            key={v}
            onClick={() => setVariant(v)}
            className={cn(
              "hover:bg-secondary hover:text-accent-foreground h-full cursor-pointer rounded-lg px-2 py-1.5",
              variant === v && "bg-secondary text-accent-foreground"
            )}>
            {v}
          </div>
        ))}
      </div>
    )
  );
}

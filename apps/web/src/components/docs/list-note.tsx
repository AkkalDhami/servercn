import { cn } from "@/lib/utils";
import React from "react";

export default function LNote({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "xsm:max-w[360px] text my-3 flex max-w-[320px] gap-2 border-l-4 border-neutral-500 bg-muted px-3 py-2 text-primary sm:py-2.5 md:max-w-200",
        className
      )}>
      {children}
    </div>
  );
}

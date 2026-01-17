import { cn } from "@/lib/utils";
import React from "react";

export function Heading({
  children,
  as = "h2",
  className
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  const Tag = as || "h2";
  return (
    <Tag
      className={cn(
        "mb-3 text-3xl font-bold sm:text-4xl",
        Tag === "h2" && "text-2xl font-medium sm:text-3xl sm:font-semibold",
        className
      )}>
      {children}
    </Tag>
  );
}

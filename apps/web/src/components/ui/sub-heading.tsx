import { cn } from "@/lib/utils";
import React from "react";

export function SubHeading({
  children,
  as = "p",
  className,
}: {
  children: React.ReactNode;
  as?: "h3" | "p";
  className?: string;
}) {
  const Tag = as || "hp";
  return (
    <Tag
      className={cn(
        "text-muted-foreground mx-auto max-w-3xl text-base sm:text-lg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

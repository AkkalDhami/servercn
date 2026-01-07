"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./border-beam";

interface HeaderBadgeProps {
  children: ReactNode;
  className?: string;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-background group relative mb-6 inline-flex items-center space-x-2 rounded-full border border-neutral-300 px-4 py-2 font-mono text-sm sm:text-base dark:border-neutral-700",
        className,
      )}
    >
      {children}

      <BorderBeam
        size={60}
        duration={12}
        initialOffset={29}
        className="via-primary dark:via-primary from-transparent to-transparent"
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      />
    </div>
  );
};

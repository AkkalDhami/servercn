"use client";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "container mx-auto pb-6 w-full max-w-360 px-4",
        className
      )}
      {...props}>
      {children}
    </section>
  );
};

import React from "react";

export default function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-secondary text-accent-foreground rounded-md px-1.5 py-0.5">{children}</code>;
}

"use client";

import { useState } from "react";
import CopyButton from "./copy-button";

export function CodeWrapper({
  children,
  code
}: {
  children: React.ReactNode;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-md bg-transparent">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="absolute top-1/2 right-2 z-10 w-auto -translate-y-1/2 cursor-pointer bg-transparent p-1.5 text-xs"
      />
      {children}
    </div>
  );
}

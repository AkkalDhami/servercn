"use client";

import { useState } from "react";
import CopyButton from "./copy-button";

export function CodeWrapper({ children, code }: { children: React.ReactNode; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-md">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="bg-editor absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer text-xs text-neutral-400 hover:text-white"
      />
      {children}
    </div>
  );
}

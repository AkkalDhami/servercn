"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import CopyButton from "./copy-button";

export function CodeWrapper({
  children,
  code,
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
    <div className="relative w-full rounded-md">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 bg-[#0b0e14] text-xs text-neutral-400 hover:text-white"
      />
      {children}
    </div>
  );
}

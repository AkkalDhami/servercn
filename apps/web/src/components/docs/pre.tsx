"use client";

import * as React from "react";
import CopyButton from "./copy-button";
import { cn } from "@/lib/utils";

export function Pre({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    if (!ref.current) return;

    const code = ref.current.querySelector("code")?.innerText;
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative w-full max-w-[800px]">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-md bg-neutral-500/10 backdrop-blur-md transition-all"
      />
      <pre ref={ref} {...props} className={cn("bg-muted max-h-120 w-full overflow-auto rounded-lg p-4 font-mono leading-relaxed", className)}>
        {children}
      </pre>
    </div>
  );
}

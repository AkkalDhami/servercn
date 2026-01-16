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
        className="bg-editor absolute right-5 bottom-6 z-20 flex items-center justify-center rounded-md py-1 transition-all"
      />
      <pre ref={ref} {...props} className={cn("bg-editor mt-4 max-h-120 w-full overflow-auto rounded-lg p-4 font-mono leading-relaxed", className)}>
        {children}
      </pre>
    </div>
  );
}

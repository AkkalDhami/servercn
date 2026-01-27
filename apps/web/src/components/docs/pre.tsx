"use client";

import * as React from "react";
import CopyButton from "./copy-button";
import { cn } from "@/lib/utils";
import { useCodeThemeBg } from "@/store/use-code-theme";

export function Pre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const { bg } = useCodeThemeBg();
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
        className="absolute right-3 bottom-3 z-20 flex items-center justify-center rounded-md py-2 transition-all"
      />
      <pre
        ref={ref}
        {...props}
        className={cn(
          "bg-editor thin-scrollbar mt-4 max-h-120 w-full overflow-auto rounded-lg p-4 font-mono leading-relaxed",
          className
        )}
        style={{ backgroundColor: bg }}>
        {children}
      </pre>
    </div>
  );
}

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
    <div className="thin-scrollbar relative max-w-[472.5px] overflow-x-auto sm:w-full sm:max-w-200 mb-3">
      <pre
        ref={ref}
        {...props}
        className={cn("thin-scrollbar relative my-2 rounded-md", className)}
        style={{
          backgroundColor: bg
        }}>
        <CopyButton
          handleCopy={copy}
          copied={copied}
          className={cn(
            "absolute right-4 bottom-3 z-20 flex items-center justify-center py-2 transition-all"
          )}
        />
        {children}
      </pre>
    </div>
  );
}

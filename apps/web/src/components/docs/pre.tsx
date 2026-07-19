"use client";

import * as React from "react";
import CopyButton from "./copy-button";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function Pre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const { copied, copy } = useCopyToClipboard();

  async function handleCopy() {
    if (!ref.current) return;

    const code = ref.current.querySelector("code")?.innerText;
    if (!code) return;

    await copy(code);
  }

  return (
    <div className="thin-scrollbar relative overflow-x-auto rounded-lg">
      <pre
        ref={ref}
        {...props}
        className={cn(
          "thin-scrollbar text-muted-primary relative",
          className
        )}
        style={{
          backgroundColor: "var(--code)"
        }}>
        <CopyButton
          handleCopy={handleCopy}
          copied={copied}
          className={cn(
            "bg-code absolute right-4 bottom-3 z-20 flex items-center justify-center transition-all"
          )}
        />
        {children}
      </pre>
    </div>
  );
}

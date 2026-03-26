"use client";

import * as React from "react";
import CopyButton from "./copy-button";
import { cn } from "@/lib/utils";
import { useCodeThemeBg } from "@/store/use-code-theme";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function Pre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const { copied, copy } = useCopyToClipboard();

  const { bg } = useCodeThemeBg();
  async function handleCopy() {
    if (!ref.current) return;

    const code = ref.current.querySelector("code")?.innerText;
    if (!code) return;

    await copy(code);
  }

  return (
    <div className="thin-scrollbar relative mb-3 max-w-[400.5px] overflow-x-auto rounded-lg sm:w-full sm:max-w-200">
      <pre
        ref={ref}
        {...props}
        className={cn("thin-scrollbar relative my-2 rounded-lg", className)}
        style={{
          backgroundColor: bg
        }}>
        <CopyButton
          bg={bg}
          handleCopy={handleCopy}
          copied={copied}
          className={cn(
            "absolute right-4 bottom-3 z-20 flex items-center justify-center transition-all"
          )}
        />
        {children}
      </pre>
    </div>
  );
}

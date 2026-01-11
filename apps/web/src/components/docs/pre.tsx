"use client";

import * as React from "react";
import CopyButton from "./copy-button";

export function Pre(props: React.HTMLAttributes<HTMLPreElement>) {
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
    <div className="relative w-full max-w-[900px] overflow-auto rounded-md bg-[#0b0e14]">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="absolute top-5 right-3 w-auto p-0 z-10 cursor-pointer bg-[#0b0e14] text-xs text-neutral-400 hover:text-white"
      />

      <pre
        ref={ref}
        {...props}
        className="code-wrapper max-h-120 overflow-x-auto rounded-md p-3"
      />
    </div>
  );
}

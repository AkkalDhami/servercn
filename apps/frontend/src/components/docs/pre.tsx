"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
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
    <div className="max-w-4xl max-h-120 rounded-md relative overflow-x-auto w-full bg-[#0b0e14]">
      <CopyButton
        handleCopy={copy}
        copied={copied}
        className="absolute cursor-pointer right-1.5 top-5 z-10  text-xs text-neutral-400 hover:text-white"
      />

      <pre
        ref={ref}
        {...props}
        className="code-wrapper max-w-4xl max-h-120 rounded-md p-3 w-full overflow-x-auto "
      />
    </div>
  );
}

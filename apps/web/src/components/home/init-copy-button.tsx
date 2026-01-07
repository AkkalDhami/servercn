"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import CopyButton from "../docs/copy-button";
export default function InitCopyButton() {
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="group bg-background relative flex w-60 cursor-pointer items-center gap-5 rounded-md px-3 py-1 text-center font-mono"
    >
      <div className="text-primary">
        <span
          className={cn(
            "text-muted-secondary",
            "group-hover:text-accent-foreground duration-200",
            copied && "text-accent-foreground",
          )}
        >
          $
        </span>{" "}
        <span
          ref={inputRef}
          className={cn(
            "text-muted-secondary",
            "group-hover:text-accent-foreground duration-200",
            copied && "text-accent-foreground",
          )}
        >
          npx servercn init
        </span>
      </div>
      <CopyButton
        handleCopy={handleCopy}
        copied={copied}
        className="group-hover:text-accent-foreground"
      />
    </div>
  );
}

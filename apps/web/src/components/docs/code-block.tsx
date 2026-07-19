"use client";

import { DEFAULT_CODE_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCodeTheme } from "@/store/use-code-theme";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export function CodeBlock({
  code,
  lang = "bash",
  className
}: {
  code: string;
  lang?: string;
  className?: string;
}) {
  const theme = useCodeTheme();

  const [html, setHtml] = useState(code);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function highlight() {
      const out = await codeToHtml(code, {
        lang,
        theme: theme.theme || DEFAULT_CODE_THEME
      });
      setHtml(out);
      setLoading(false);
    }

    highlight();
  }, [code, lang, theme.theme]);

  if (loading) {
    return (
      <>
        <pre
          className={cn("overflow-x-auto overscroll-x-contain p-4", className)}>
          <code
            data-theme="vesper github-light"
            data-language="bash"
            className="font-code leading-none">
            <span>{code}</span>
          </code>
        </pre>{" "}
      </>
    );
  }

  return (
    <div
      className={cn(
        "[&_pre]:bg-code! relative [&_pre]:overflow-x-auto [&_pre]:rounded-b-md [&_pre]:px-4 [&_pre]:py-4",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

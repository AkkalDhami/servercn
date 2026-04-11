"use client";

import { DEFAULT_CODE_THEME } from "@/lib/constants";
import { useCodeTheme } from "@/store/use-code-theme";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

export function CodeBlock({
  code,
  lang = "bash"
}: {
  code: string;
  lang?: string;
}) {
  const theme = useCodeTheme();

  const [html, setHtml] = useState("npx servercn-cli@latest init");

  useEffect(() => {
    async function highlight() {
      const out = await codeToHtml(code, {
        lang,
        theme: theme.theme || DEFAULT_CODE_THEME
      });
      setHtml(out);
    }

    highlight();
  }, [code, lang]);

  return (
    <div
      className="relative [&_pre]:max-h-80 [&_pre]:max-w-[320px] [&_pre]:overflow-x-auto [&_pre]:rounded-b-md [&_pre]:px-4 [&_pre]:py-4 sm:[&_pre]:max-w-2xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

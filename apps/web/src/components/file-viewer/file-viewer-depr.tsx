"use client";

import { useCodeTheme, useCodeThemeBg } from "@/store/use-code-theme";
import { useEffect, useState } from "react";
import { highlightCode } from "@/app/actions/highlight";

export default function FileViewer({ content ,lang}: { content?: string ,lang?: string }) {
  const { theme } = useCodeTheme();
  const { bg } = useCodeThemeBg();
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHtml("");
      return;
    }

    const highlight = async () => {
      const result = await highlightCode(content, lang || "ts", theme);
      setHtml(result);
    };

    highlight();
  }, [content, theme]);

  if (!content) {
    return (
      <div className="text-muted-foreground flex h-130 flex-col items-center justify-center space-y-2.5">
        <p className="text-2xl font-medium">servercn</p>
        <p className="text-base font-normal">
          select a file to view its contents
        </p>
      </div>
    );
  }

  return (
    <div className="h-full max-h-125 w-full" style={{ backgroundColor: bg }}>
      <div
        className="relative [&_pre]:h-full [&_pre]:overflow-x-auto [&_pre]:p-3.5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

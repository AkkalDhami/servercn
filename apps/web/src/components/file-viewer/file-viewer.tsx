"use client";

import { useCodeTheme } from "@/store/use-code-theme";
import { useEffect, useState } from "react";
import { highlightCode } from "@/app/actions/highlight";

export default function FileViewer({ content }: { content?: string }) {
  const { theme } = useCodeTheme();
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHtml("");
      return;
    }

    const highlight = async () => {
      const result = await highlightCode(content, "ts", theme);
      setHtml(result);
    };

    highlight();
  }, [content, theme]);

  if (!content) {
    return <div className="text-muted-foreground flex h-full items-center justify-center">Select a file to view its contents</div>;
  }

  return (
    <div className="h-full max-h-125 w-full bg-black whitespace-nowrap">
      <div className="relative  [&_pre]:h-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:p-3.5" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

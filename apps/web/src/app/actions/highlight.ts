"use server";

import { getSingletonHighlighter } from "shiki";
import { DEFAULT_CODE_THEME } from "@/lib/constants";

const getHighlighter = (theme: string) =>
  getSingletonHighlighter({
    themes: [theme],
    langs: ["bash", "ts", "json"]
  });

export async function highlightCode(code: string, lang: string = "ts", theme: string = DEFAULT_CODE_THEME) {
  try {
    const highlighter = await getHighlighter(theme);
    return highlighter.codeToHtml(code, {
      lang,
      theme
    });
  } catch (error) {
    console.error("Highlighting error:", error);
    return `<pre><code>${code}</code></pre>`;
  }
}


import { getSingletonHighlighter } from "shiki";

export const PRIMRY_CODE_BLOCK_THEME = "ayu-dark" as const;

const highlighter = await getSingletonHighlighter({
  themes: [PRIMRY_CODE_BLOCK_THEME],
  langs: ["bash", "ts"],
});

export async function CodeBlock({
  code,
  lang = "bash",
}: {
  code: string;
  lang?: string;
}) {
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: PRIMRY_CODE_BLOCK_THEME,
  });

  return (
    <div
      className="relative [&_pre]:w-4xl [&_pre]:max-h-80 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:py-4 [&_pre]:px-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

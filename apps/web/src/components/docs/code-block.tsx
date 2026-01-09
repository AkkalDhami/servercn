import { getSingletonHighlighter } from "shiki";

export const PRIMRY_CODE_BLACK_THEME = "ayu-dark" as const;

const highlighter = await getSingletonHighlighter({
  themes: [PRIMRY_CODE_BLACK_THEME],
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
    theme: PRIMRY_CODE_BLACK_THEME,
  });

  return (
    <div
      className="relative [&_pre]:max-h-80 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

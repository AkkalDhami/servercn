import { PRIMRY_CODE_BLACK_THEME } from "../docs/code-block";
import { getSingletonHighlighter } from "shiki";
const highlighter = await getSingletonHighlighter({
  themes: [PRIMRY_CODE_BLACK_THEME],
  langs: ["bash", "ts", "json"],
});
export default function FileViewer({ content }: { content?: string }) {
  if (!content) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        Select a file to view its contents
      </div>
    );
  }

  const html = highlighter.codeToHtml(content, {
    lang: "ts",
    theme: PRIMRY_CODE_BLACK_THEME,
  });
  console.log({ html });

  return (
    <div className="h-full max-h-125 w-full bg-[#0b0e14] whitespace-nowrap">
      <div
        className="relative [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:px-1 [&_pre]:py-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

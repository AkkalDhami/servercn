import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PRIMRY_CODE_BLOCK_THEME } from "../docs/code-block";
import { getSingletonHighlighter } from "shiki";
const highlighter = await getSingletonHighlighter({
  themes: [PRIMRY_CODE_BLOCK_THEME],
  langs: ["bash", "ts", "json"],
});
export default function FileViewer({ content }: { content?: string }) {
  if (!content) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a file to view its contents
      </div>
    );
  }

  const html = highlighter.codeToHtml(content, {
    lang: "ts",
    theme: PRIMRY_CODE_BLOCK_THEME,
  });
  console.log({ html });

  return (
    <div className="max-h-125 w-full bg-[#0b0e14] h-full whitespace-nowrap">
      <div
        className="relative [&_pre]:rounded-md [&_pre]:py-4 [&_pre]:px-1  [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

import { getSingletonHighlighter } from "shiki";
import { COOKIE_THEME_KEY, DEFAULT_CODE_THEME } from "@/lib/constants";
import { cookies } from "next/headers";

const getHighlighter = (theme: string) =>
  getSingletonHighlighter({
    themes: [theme],
    langs: ["bash", "ts"]
  });

export async function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get(COOKIE_THEME_KEY)?.value ?? DEFAULT_CODE_THEME;

  const highlighter = await getHighlighter(theme);

  const html = highlighter.codeToHtml(code, {
    lang,
    theme
  });

  return (
    <div
      className="relative [&_pre]:max-h-80 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

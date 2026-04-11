"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useCodeTheme, useCodeThemeBg } from "@/store/use-code-theme";
import { toggleCodeTheme } from "@/app/actions/theme";

type Options = {
  key?: string;
  requireShift?: boolean;
};

export function useThemeToggleHotkey(options: Options = {}) {
  const { key = "d", requireShift = false } = options;

  const { setTheme: setCodeTheme, theme: codeTheme } = useCodeTheme();
  const { theme, systemTheme } = useTheme();
  const { setBg } = useCodeThemeBg();

  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      if (requireShift && !e.shiftKey) return;

      const currentTheme = theme === "system" ? systemTheme : theme;
      const result = await toggleCodeTheme(currentTheme || "dark", codeTheme);
      setTheme(result.appTheme);
      setBg(result.codeThemeBg);
      setCodeTheme(result.codeTheme);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, requireShift, resolvedTheme, setTheme]);
}

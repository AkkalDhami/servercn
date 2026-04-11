"use client";

import { useThemeToggleHotkey } from "@/hooks/use-theme-hotkey";

export function HotkeyProvider({ children }: { children: React.ReactNode }) {
  useThemeToggleHotkey();

  return <>{children}</>;
}

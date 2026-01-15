"use server";

import { COOKIE_THEME_KEY, DEFAULT_CODE_THEME } from "@/lib/constants";
import { LIGHT_THEMES } from "@/lib/themes";
import { cookies } from "next/headers";

export async function toggleCodeTheme(currentAppTheme: string, currentCodeTheme: string) {
  const cookieStore = await cookies();
  const nextAppTheme = currentAppTheme === "dark" ? "light" : "dark";

  let nextCodeTheme: string;

  if (nextAppTheme === "light") {
    const currentThemeIsLight = LIGHT_THEMES.some(t => t.value === currentCodeTheme);
    if (!currentThemeIsLight) {
      cookieStore.set("servercn-last-dark-theme", currentCodeTheme, { path: "/" });
    }

    if (LIGHT_THEMES.length > 0) {
      const randomIndex = Math.floor(Math.random() * LIGHT_THEMES.length);
      nextCodeTheme = LIGHT_THEMES[randomIndex].value;
    } else {
      nextCodeTheme = currentCodeTheme;
    }
  } else {
    nextCodeTheme = cookieStore.get("servercn-last-dark-theme")?.value || DEFAULT_CODE_THEME;
  }

  cookieStore.set(COOKIE_THEME_KEY, nextCodeTheme, { path: "/" });

  return {
    appTheme: nextAppTheme,
    codeTheme: nextCodeTheme
  };
}

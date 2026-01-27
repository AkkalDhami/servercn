"use server";

import {
  CODE_THEME_BG_KEY,
  COOKIE_THEME_KEY,
  DEFAULT_CODE_THEME
} from "@/lib/constants";
import { LIGHT_THEMES, THEME_PRIMARY_BG } from "@/lib/themes";
import { cookies } from "next/headers";

export async function toggleCodeTheme(
  currentAppTheme: string,
  currentCodeTheme: string
) {
  const cookieStore = await cookies();
  const nextAppTheme = currentAppTheme === "dark" ? "light" : "dark";

  let nextCodeTheme: string;
  let nextCodeThemeBg: string;

  if (nextAppTheme === "light") {
    const currentThemeIsLight = LIGHT_THEMES.some(
      t => t.value === currentCodeTheme
    );
    if (!currentThemeIsLight) {
      cookieStore.set("servercn-last-dark-theme", currentCodeTheme, {
        path: "/"
      });
    }

    if (LIGHT_THEMES.length > 0) {
      const randomIndex = Math.floor(Math.random() * LIGHT_THEMES.length);
      nextCodeTheme = LIGHT_THEMES[randomIndex].value;
      nextCodeThemeBg =
        THEME_PRIMARY_BG[nextCodeTheme as keyof typeof THEME_PRIMARY_BG];
    } else {
      nextCodeTheme = currentCodeTheme;
      nextCodeThemeBg =
        THEME_PRIMARY_BG[nextCodeTheme as keyof typeof THEME_PRIMARY_BG];
    }
  } else {
    nextCodeTheme =
      cookieStore.get("servercn-last-dark-theme")?.value || DEFAULT_CODE_THEME;
    nextCodeThemeBg =
      THEME_PRIMARY_BG[nextCodeTheme as keyof typeof THEME_PRIMARY_BG];
  }

  cookieStore.set(COOKIE_THEME_KEY, nextCodeTheme, { path: "/" });
  cookieStore.set(CODE_THEME_BG_KEY, nextCodeThemeBg, { path: "/" });

  return {
    appTheme: nextAppTheme,
    codeTheme: nextCodeTheme,
    codeThemeBg: nextCodeThemeBg
  };
}

export async function changeCodeBlockBg() {
  const cookieStore = await cookies();
  const codeTheme =
    cookieStore.get(COOKIE_THEME_KEY)?.value || DEFAULT_CODE_THEME;
  const bg = THEME_PRIMARY_BG[codeTheme as keyof typeof THEME_PRIMARY_BG];

  cookieStore.set(CODE_THEME_BG_KEY, bg, { path: "/" });
  return bg;
}

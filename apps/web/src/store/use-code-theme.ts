import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  STORAGE_THEME_KEY,
  DEFAULT_CODE_THEME,
  COOKIE_THEME_KEY,
  CODE_THEME_BG_KEY
} from "@/lib/constants";
import { CODE_THEMES } from "@/lib/themes";

interface CodeThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

interface CodeThemeBgState {
  bg: string;
  setBg: (bg: string) => void;
}

export const useCodeThemeBg = create<CodeThemeBgState>()(
  persist(
    set => ({
      bg: "#101010",
      setBg: (bg: string) => {
        set({ bg });
        if (typeof document !== "undefined") {
          document.cookie = `${CODE_THEME_BG_KEY}=${bg}; path=/; max-age=31536000`;
        }
      }
    }),
    {
      name: CODE_THEME_BG_KEY
    }
  )
);

export const useCodeTheme = create<CodeThemeState>()(
  persist(
    set => ({
      theme: DEFAULT_CODE_THEME,
      setTheme: (theme: string) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.cookie = `${COOKIE_THEME_KEY}=${theme}; path=/; max-age=31536000`;

          const themeInfo = CODE_THEMES.find(t => t.value === theme);
          if (!themeInfo || !themeInfo.light) {
            document.cookie = `servercn-last-dark-theme=${theme}; path=/; max-age=31536000`;
          }
        }
      }
    }),
    {
      name: STORAGE_THEME_KEY
    }
  )
);

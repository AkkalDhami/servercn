import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_THEME_KEY, DEFAULT_CODE_THEME, COOKIE_THEME_KEY } from "@/lib/constants";

interface CodeThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useCodeTheme = create<CodeThemeState>()(
  persist(
    set => ({
      theme: DEFAULT_CODE_THEME,
      setTheme: (theme: string) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.cookie = `${COOKIE_THEME_KEY}=${theme}; path=/; max-age=31536000`;
        }
      }
    }),
    {
      name: STORAGE_THEME_KEY
    }
  )
);

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { toggleCodeTheme } from "@/app/actions/theme";
import { useCodeTheme, useCodeThemeBg } from "@/store/use-code-theme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();
  const { theme: codeTheme, setTheme: setCodeTheme } = useCodeTheme();
  const { setBg } = useCodeThemeBg();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = async () => {
    const result = await toggleCodeTheme(currentTheme || "dark", codeTheme);
    setTheme(result.appTheme);
    setCodeTheme(result.codeTheme);
    setBg(result.codeThemeBg);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {currentTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}

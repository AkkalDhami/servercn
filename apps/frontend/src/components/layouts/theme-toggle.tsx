"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {currentTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}

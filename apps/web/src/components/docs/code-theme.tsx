"use client";

import { useEffect, useId, useState } from "react";
import { STORAGE_THEME_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useCodeTheme } from "@/store/use-code-theme";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CODE_THEMES } from "@/lib/themes";

export { STORAGE_THEME_KEY };

export default function CodeTheme() {
  const { theme, setTheme } = useCodeTheme();
  const router = useRouter();
  const id = useId();

  const [open, setOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        Code Theme
      </Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="border-input bg-background hover:bg-background w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            id={id}
            role="combobox"
            variant="outline">
            <span className="truncate">{CODE_THEMES.find(t => t.value === theme)?.label || "Select theme"}</span>
            <ChevronDownIcon aria-hidden="true" className="text-muted-foreground/80 shrink-0" size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="border-input w-full min-w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search theme..." />
            <CommandList>
              <CommandEmpty>No theme found.</CommandEmpty>
              <CommandGroup>
                {CODE_THEMES.sort((a, b) => a.label.localeCompare(b.label)).map(t => (
                  <CommandItem
                    key={t.value}
                    onSelect={() => {
                      setTheme(t.value);
                      setOpen(false);
                      router.refresh();
                    }}
                    value={t.value}
                    className="flex items-center justify-between">
                    {t.label}
                    <div className="flex items-center gap-2">
                      {theme === t.value && <CheckIcon className="ml-auto" size={16} />}
                      {t.isFavorite && <span className="bg-primary size-2 rounded-full"></span>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SiExpress, SiNestjs, SiNextdotjs } from "react-icons/si";
import { usePathname, useRouter } from "next/navigation";
import { Route } from "next";
import {
  useFramework,
  Framework as FrameworkType
} from "@/store/use-framework";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { LanguageIcons } from "./icons/language-icons";

const FRAMEWORK_SECTIONS = [
  "blueprints",
  "components",
  "foundations",
  "schemas"
];

type SelectFrameworkMode = "docs" | "store-only";

const FRAMEWORK_OPTIONS: {
  value: FrameworkType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "express", label: "Express.js", icon: SiExpress },
  { value: "nextjs", label: "Next.js", icon: SiNextdotjs },
  { value: "nestjs", label: "Nest.js", icon: SiNestjs }
];

export function SelectFramework({
  mode = "docs"
}: {
  mode?: SelectFrameworkMode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { framework, setFramework } = useFramework();

  // Detect current framework from URL
  const segments = pathname.split("/").filter(Boolean);
  const currentFrameworkFromUrl: FrameworkType | null =
    segments[1] === "express" ||
    segments[1] === "nestjs" ||
    segments[1] === "nextjs"
      ? (segments[1] as FrameworkType)
      : null;

  // Sync URL framework with store on mount and URL change (docs routes only)
  useEffect(() => {
    if (mode !== "docs") return;
    if (currentFrameworkFromUrl && currentFrameworkFromUrl !== framework) {
      setFramework(currentFrameworkFromUrl);
    }
  }, [mode, currentFrameworkFromUrl, framework, setFramework]);

  // Determine the value to display in the select
  // Priority: URL framework > Stored framework > "express" (default)
  const displayValue = currentFrameworkFromUrl || framework || "express";

  const handleChange = (value: FrameworkType) => {
    setFramework(value);

    if (mode === "store-only") return;

    const currentSegments = pathname.split("/").filter(Boolean);

    if (currentSegments[0] !== "docs") return;

    // Remove existing framework if present
    if (
      currentSegments[1] === "express" ||
      currentSegments[1] === "nestjs" ||
      currentSegments[1] === "nextjs"
    ) {
      currentSegments.splice(1, 1);
    }

    const section = currentSegments[1];

    // Only apply framework to framework-based sections
    if (!FRAMEWORK_SECTIONS.includes(section)) return;

    // Insert framework after /docs
    if (value) {
      currentSegments.splice(1, 0, value);
    }

    router.push(`/${currentSegments.join("/")}` as Route);
  };

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        Select Framework
      </Label>

      <Select value={displayValue} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Framework" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="express">
              <div className="flex items-center gap-3 font-medium">
                <SiExpress className="text-primary size-4" />
                Express.js
              </div>
            </SelectItem>

            <SelectItem value="nextjs">
              <div className="flex items-center gap-3 font-medium">
                <SiNextdotjs className="text-primary size-4" />
                Next.js
              </div>
            </SelectItem>

            <SelectItem value="nestjs">
              <div className="flex items-center gap-3 font-medium">
                <SiNestjs className="text-primary size-4" />
                Nest.js
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function FrameworkTabs({
  mode = "docs"
}: {
  mode?: SelectFrameworkMode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { framework, setFramework } = useFramework();

  // Detect current framework from URL
  const segments = pathname.split("/").filter(Boolean);
  const currentFrameworkFromUrl: FrameworkType | null =
    segments[1] === "express" ||
    segments[1] === "nestjs" ||
    segments[1] === "nextjs"
      ? (segments[1] as FrameworkType)
      : null;

  // Sync URL framework with store on mount and URL change (docs routes only)
  useEffect(() => {
    if (mode !== "docs") return;
    if (currentFrameworkFromUrl && currentFrameworkFromUrl !== framework) {
      setFramework(currentFrameworkFromUrl);
    }
  }, [mode, currentFrameworkFromUrl, framework, setFramework]);

  // Determine the value to display in the tabs
  // Priority: URL framework > Stored framework > "express" (default)
  const displayValue = currentFrameworkFromUrl || framework || "express";

  const handleChange = (value: string) => {
    const frameworkValue = value as FrameworkType;
    setFramework(frameworkValue);

    if (mode === "store-only") return;

    const currentSegments = pathname.split("/").filter(Boolean);

    if (currentSegments[0] !== "docs") return;

    // Remove existing framework if present
    if (
      currentSegments[1] === "express" ||
      currentSegments[1] === "nestjs" ||
      currentSegments[1] === "nextjs"
    ) {
      currentSegments.splice(1, 1);
    }

    const section = currentSegments[1];

    // Only apply framework to framework-based sections
    if (!FRAMEWORK_SECTIONS.includes(section)) return;

    // Insert framework after /docs
    if (frameworkValue) {
      currentSegments.splice(1, 0, frameworkValue);
    }

    router.push(`/${currentSegments.join("/")}` as Route);
  };

  const Icon = LanguageIcons[displayValue];

  return (
    <div className="border-border relative flex w-full items-center justify-between gap-10">
      <div className="flex gap-8">
        {FRAMEWORK_OPTIONS.map(({ value, label }) => {
          const isActive = displayValue === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleChange(value)}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 py-2 text-base font-medium outline-none sm:text-lg",
                value === "nestjs" && "pointer-events-none"
              )}>
              <span
                className={cn(
                  isActive
                    ? "text-foreground border-b-primary"
                    : "text-muted-foreground border-transparent",
                  `border-b-[2.3px] transition-colors`,
                  "hover:text-primary pb-1.25"
                )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <Icon className={`text-muted-foreground size-6`} />
    </div>
  );
}

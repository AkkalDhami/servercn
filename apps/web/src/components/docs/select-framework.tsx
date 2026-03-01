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
import { SiExpress, SiNestjs } from "react-icons/si";
import { usePathname, useRouter } from "next/navigation";
import { Route } from "next";
import {
  useFramework,
  Framework as FrameworkType
} from "@/store/use-framework";
import { useEffect } from "react";
import { Framework } from "@/@types/registry";

const FRAMEWORK_SECTIONS = [
  "blueprints",
  "components",
  "foundations",
  "schemas"
];

export function SelectFramework() {
  const router = useRouter();
  const pathname = usePathname();
  const { framework, setFramework } = useFramework();

  // Detect current framework from URL
  const segments = pathname.split("/").filter(Boolean);
  const currentFrameworkFromUrl: FrameworkType =
    segments[1] === "express" || segments[1] === "nestjs"
      ? (segments[1] as Framework)
      : null;

  // Sync URL framework with store on mount and URL change
  useEffect(() => {
    if (currentFrameworkFromUrl && currentFrameworkFromUrl !== framework) {
      setFramework(currentFrameworkFromUrl);
    }
  }, [currentFrameworkFromUrl, framework, setFramework]);

  // Determine the value to display in the select
  // Priority: URL framework > Stored framework > "express" (default)
  const displayValue = currentFrameworkFromUrl || framework || "express";

  const handleChange = (value: Framework) => {
    // Update the store
    setFramework(value);

    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] !== "docs") return;

    // Remove existing framework if present
    if (segments[1] === "express" || segments[1] === "nestjs") {
      segments.splice(1, 1);
    }

    const section = segments[1];

    // Only apply framework to framework-based sections
    if (!FRAMEWORK_SECTIONS.includes(section)) return;

    // Insert framework after /docs
    if (value) {
      segments.splice(1, 0, value);
    }

    router.push(`/${segments.join("/")}` as Route);
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

            <SelectItem value="nestjs">
              <div className="flex items-center gap-3 font-medium">
                <SiNestjs className="text-primary size-4" />
                NestJS
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

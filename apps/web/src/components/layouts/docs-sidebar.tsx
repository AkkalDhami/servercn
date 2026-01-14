"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTypeItems } from "@/lib/source";
import CodeTheme from "../docs/code-theme";

export const ITEM_GROUP_NAMING = {
  guide: "Getting Started",
  foundation: "Foundations",
  component: "Components",
  blueprint: "Blueprints",
  schema: "Schemas"
} as const;

const navSections = [
  { title: ITEM_GROUP_NAMING.guide, items: getTypeItems("guide") },
  { title: ITEM_GROUP_NAMING.foundation, items: getTypeItems("foundation") },
  { title: ITEM_GROUP_NAMING.component, items: getTypeItems("component") },
  { title: ITEM_GROUP_NAMING.blueprint, items: getTypeItems("blueprint") },
  { title: ITEM_GROUP_NAMING.schema, items: getTypeItems("schema") }
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav className="no-scrollbar font-inter sticky top-18 left-0 z-10 h-full max-h-[calc(100vh-2rem)] w-full space-y-6 overflow-y-auto px-3 pb-14">
      <CodeTheme />

      {navSections.map(section => {
        if (!section.items.length) return null;

        return (
          <div key={section.title}>
            <h3 className="w-11/12 pb-4 text-sm font-[450] uppercase">{section.title}</h3>

            <ul className="mb-3 space-y-3.5 border-l border-zinc-200 dark:border-zinc-800">
              {section.items.map(item => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                const isSchema = item.type === "schema";
                const isOpen = openSlug === item.slug;

                return (
                  <li key={item.slug}>
                    <Link
                      href={item.url as Route}
                      onClick={() => (isSchema ? setOpenSlug(isOpen ? null : item.slug) : setOpenSlug(null))}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center justify-between pl-4 text-base font-medium transition-colors",
                        isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      )}>
                      {isActive && <span className="bg-primary absolute top-0 left-0 h-full w-px" />}

                      <span>{item.title}</span>

                      {isSchema && item.meta && item.meta?.models?.length > 0 && (
                        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                      )}

                      {item.status === "unstable" && <span className="ml-2 h-2 w-2 rounded-full bg-yellow-500" />}
                    </Link>

                    {/* Schema models */}
                    {isSchema && isOpen && item.meta?.models && (
                      <ul className="mt-2 space-y-2 border-l border-zinc-200 pl-6 dark:border-zinc-800">
                        {item.meta.models.map(model => {
                          const modelPath = model.slug;
                          const modelActive = pathname === modelPath || pathname.startsWith(`${modelPath}/`);
                          console.log({ model, modelActive, modelPath });
                          return (
                            <li key={model.slug}>
                              <Link
                                href={modelPath as Route}
                                className={cn(
                                  "block text-sm capitalize transition-colors",
                                  modelActive ? "text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                                )}>
                                {model.label} Schema
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

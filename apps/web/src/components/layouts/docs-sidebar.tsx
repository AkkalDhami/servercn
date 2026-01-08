"use client";

import registry from "@/data/registry.json";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import SearchCommand from "../command/search-command";
import { Route } from "next";
import { getTypeItems } from "@/lib/source";

export const ITEM_GROUP_NAMING = {
  guide: "Getting Started",
  component: "Components",
  blueprint: "Blueprints",
  foundation: "Foundations",
  model: "Models",
};

const navSections = [
  {
    title: ITEM_GROUP_NAMING.guide,
    items: getTypeItems("guide"),
  },
  {
    title: ITEM_GROUP_NAMING.foundation,
    items: getTypeItems("foundation"),
  },
  {
    title: ITEM_GROUP_NAMING.component,
    items: getTypeItems("component"),
  },
  {
    title: ITEM_GROUP_NAMING.blueprint,
    items: getTypeItems("blueprint"),
  },

  {
    title: ITEM_GROUP_NAMING.model,
    items: getTypeItems("model"),
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar sticky top-18 left-0 z-10 h-full max-h-[calc(100vh-6rem)] w-full space-y-6 overflow-y-auto px-3">
      <SearchCommand />
      {navSections.map((section) => (
        <div
          key={section.title}
          className={cn(section.items.length > 0 ? "" : "hidden")}
        >
          <h3 className="relative z-10 w-11/12 pb-4 text-sm/6 font-[450] uppercase">
            {section.title}
          </h3>
          <ul className="mb-3 space-y-3.5 border-l border-zinc-200 dark:border-zinc-800">
            {section.items.map((item) => {
              const active = pathname === item.url;

              return (
                <li key={item.url}>
                  <Link
                    href={item.url as Route}
                    className={cn(
                      "relative inline-flex w-full items-center pl-4 text-base font-medium",
                      active
                        ? "text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <div className="bg-primary absolute top-0 -left-px z-1 h-full w-px" />
                    )}
                    <span className="">{item.title}</span>
                    {item.status === "unstable" && (
                      <div className="absolute top-1/2 right-0 z-1 size-2 -translate-y-1/2 rounded-full bg-yellow-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";
import { motion } from "motion/react";
import { IRegistryItems } from "@/@types/registry";

import { cn } from "@/lib/utils";
import { getTypeItems } from "@/lib/source";
import CodeTheme from "../docs/code-theme";

export const ITEM_GROUP_NAMING = {
  guide: "Getting Started",
  foundation: "Foundations",
  tooling: "Tooling",
  component: "Components",
  blueprint: "Blueprints",
  schema: "Schemas"
} as const;

const navSections = [
  { title: ITEM_GROUP_NAMING.guide, items: getTypeItems("guide") },
  { title: ITEM_GROUP_NAMING.foundation, items: getTypeItems("foundation") },
  { title: ITEM_GROUP_NAMING.tooling, items: getTypeItems("tooling") },
  { title: ITEM_GROUP_NAMING.component, items: getTypeItems("component") },
  { title: ITEM_GROUP_NAMING.blueprint, items: getTypeItems("blueprint") },
  { title: ITEM_GROUP_NAMING.schema, items: getTypeItems("schema") }
];

export default function DocsSidebar({
  onLinkClickAction
}: {
  onLinkClickAction?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar font-inter sticky top-18 left-0 z-10 h-full max-h-[calc(100vh-2rem)] w-full space-y-6 overflow-y-auto px-3 pb-14">
      <CodeTheme />

      {navSections.map(section => {
        if (!section.items.length) return null;

        return (
          <div key={section.title}>
            <h3 className="w-11/12 pb-4 text-sm font-[450] uppercase">
              {section.title}
            </h3>

            <ul className="mb-3 space-y-3.5 border-l border-zinc-200 dark:border-zinc-800">
              {(section.items as IRegistryItems[]).map(item => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`);

                const isNested =
                  item.type === "schema" || item.type === "blueprint";

                return (
                  <li key={item.slug}>
                    <Link
                      onClick={onLinkClickAction}
                      href={item.url as Route}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center justify-between pl-4 text-base font-medium transition-colors",
                        isActive
                          ? "text-accent-foreground"
                          : "text-muted-primary hover:text-primary"
                      )}>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-indicator"
                          className="bg-primary absolute top-0 left-0 h-full w-px"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}

                      <span>{item.title}</span>

                      {item.status !== "stable" && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-yellow-500" />
                      )}
                    </Link>

                    {/* Schema or Blueprint databases or models */}
                    {isNested &&
                      (item.meta?.databases || item.meta?.models) && (
                        <ul className="mt-2 ml-4 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                          {(item.meta!.databases || item.meta!.models!)
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((subItem: { label: string; slug: string }) => {
                              const typePath =
                                item.type === "schema"
                                  ? "schemas"
                                  : "blueprints";
                              const subPath = `/docs/${typePath}/${subItem.slug}`;
                              const subActive =
                                pathname === subPath ||
                                pathname.startsWith(`${subPath}/`);
                              return (
                                <li key={subItem.slug}>
                                  <Link
                                    onClick={onLinkClickAction}
                                    href={subPath as Route}
                                    className={cn(
                                      "relative block text-sm capitalize transition-colors",
                                      subActive
                                        ? "text-accent-foreground font-medium"
                                        : "text-muted-secondary hover:text-primary"
                                    )}>
                                    {subActive && (
                                      <motion.span
                                        layoutId="nested-sidebar-indicator"
                                        className="bg-primary absolute top-0 -left-[17px] h-full w-px"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 30
                                        }}
                                      />
                                    )}
                                    <span>
                                      {" "}
                                      {subItem.label}{" "}
                                      {item.meta?.models ? "Schema" : ""}
                                    </span>
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

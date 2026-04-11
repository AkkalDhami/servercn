"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";
import { motion } from "motion/react";
import { IRegistryItems, ISchema } from "@/@types/registry";

import { cn } from "@/lib/utils";
import { getRegistryTypeItems, injectFramework } from "@/lib/source";
import CodeTheme from "@/components/docs/code-theme";
import { SelectFramework } from "@/components/docs/select-framework";
import { useFramework } from "@/store/use-framework";

import {
  Terminal,
  Rocket,
  Layers,
  LayoutTemplate,
  Database,
  Plug,
  Wrench,
  BookOpen,
  FileText,
  Box,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

export const ITEM_GROUP_NAMING = {
  guide: "Getting Started",
  cli: "Servercn CLI",
  foundation: "Foundations",
  tooling: "Tooling",
  component: "Components",
  blueprint: "Blueprints",
  provider: "Providers",
  schema: "Schemas",
  page: "Pages",
  contributing: "Contributing"
} as const;

export const PAGE_ITEMS = [
  {
    title: "Components",
    url: "/components"
  },
  {
    title: "Foundations",
    url: "/foundations"
  },
  {
    title: "Blueprints",
    url: "/blueprints"
  },
  {
    title: "Providers",
    url: "/providers"
  },
  {
    title: "Schemas",
    url: "/schemas"
  },
  {
    title: "Contributors",
    url: "/contributors"
  },
  {
    title: "Contributing",
    url: "/contributing"
  }
];

export default function DocsSidebar({
  onLinkClickAction
}: {
  onLinkClickAction?: () => void;
}) {
  const pathname = usePathname();
  const { framework } = useFramework();

  // Create nav sections dynamically based on framework
  const navSections = [
    {
      title: ITEM_GROUP_NAMING.guide,
      items: getRegistryTypeItems("guide"),
      icon: Rocket
    },
    {
      title: ITEM_GROUP_NAMING.cli,
      items: getRegistryTypeItems("cli"),
      icon: Terminal
    },
    {
      title: ITEM_GROUP_NAMING.foundation,
      items: getRegistryTypeItems("foundation", framework),
      icon: Layers
    },
    {
      title: ITEM_GROUP_NAMING.component,
      items: getRegistryTypeItems("component", framework),
      icon: Box
    },
    {
      title: ITEM_GROUP_NAMING.blueprint,
      items: getRegistryTypeItems("blueprint", framework),
      icon: LayoutTemplate
    },
    {
      title: ITEM_GROUP_NAMING.provider,
      items: getRegistryTypeItems("provider", framework),
      icon: Plug
    },
    {
      title: ITEM_GROUP_NAMING.schema,
      items: getRegistryTypeItems("schema", framework),
      icon: Database
    },
    {
      title: ITEM_GROUP_NAMING.tooling,
      items: getRegistryTypeItems("tooling"),
      icon: Wrench
    },
    {
      title: ITEM_GROUP_NAMING.contributing,
      items: getRegistryTypeItems("contributing"),
      icon: BookOpen
    },
    {
      title: ITEM_GROUP_NAMING.page,
      items: PAGE_ITEMS,
      icon: FileText
    }
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(navSections.map(section => [section.title, true]))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev: Record<string, boolean>) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <nav className="no-scrollbar font-inter sticky top-20 left-0 z-10 h-full max-h-[calc(100vh-2rem)] space-y-4 overflow-y-auto px-3 py-0 pb-14 text-sm lg:mb-10">
      <CodeTheme />
      <SelectFramework />

      <div className="mt-6 space-y-5">
        {navSections.map(section => {
          if (section.items.length === 0) return null;
          return (
            <div key={section.title}>
              <div
                onClick={() => toggleSection(section.title)}
                className="group flex cursor-pointer items-center justify-between gap-2 pb-4">
                <div className="flex items-center gap-2">
                  <section.icon className="text-muted-foreground group-hover:text-accent-foreground size-4" />
                  <h3 className="text-muted-foreground group-hover:text-accent-foreground text-xs font-medium tracking-wider uppercase">
                    {section.title}
                  </h3>
                </div>

                <motion.div
                  animate={{ rotate: openSections[section.title] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ChevronDown className="text-muted-foreground group-hover:text-accent-foreground size-4" />
                </motion.div>
              </div>
              <motion.ul
                initial={false}
                animate={
                  openSections[section.title]
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="mb-3 space-y-3.5 overflow-hidden border-l border-zinc-200 dark:border-zinc-800">
                {(section.items as IRegistryItems[])
                  // .filter(item => item.status === "stable")
                  .map((item, i: number) => {
                    const itemUrl = injectFramework(
                      item.url as string,
                      framework
                    );
                    // Check if current pathname matches the item (with or without framework)
                    const isActive =
                      pathname === itemUrl ||
                      pathname.startsWith(`${itemUrl}/`) ||
                      pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);

                    const isNested =
                      item.type === "schema" || item.type === "blueprint";

                    return (
                      <motion.li
                        key={`${item.slug + item.url}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{
                          opacity: openSections[section.title] ? 1 : 0,
                          y: openSections[section.title] ? 0 : -5
                        }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}>
                        <Link
                          onClick={onLinkClickAction}
                          href={itemUrl as Route}
                          className={cn(
                            "relative flex w-full cursor-pointer items-center gap-4 pl-4 text-base transition-colors",
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
                          {item.meta?.new && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                          {section.title !== "Pages" &&
                            item.status !== "stable" && (
                              <span className="ml-2 h-2 w-2 rounded-full bg-yellow-500" />
                            )}
                        </Link>

                        {/* Schema or Blueprint databases */}
                        {isNested && item.meta?.databases && (
                          <ul className="mt-2 ml-4 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                            {item
                              .meta!.databases.sort((a, b) =>
                                a.label.localeCompare(b.label)
                              )
                              .map((subItem: ISchema) => {
                                const subPath = `/docs/${subItem.slug}`;
                                const subActive =
                                  pathname === subPath ||
                                  pathname.startsWith(`${subPath}/`);
                                return (
                                  <li key={subItem.slug}>
                                    <Link
                                      onClick={onLinkClickAction}
                                      href={subPath as Route}
                                      className={cn(
                                        "relative flex items-center gap-2 text-sm capitalize transition-colors",
                                        subActive
                                          ? "text-accent-foreground"
                                          : "text-muted-secondary hover:text-primary"
                                      )}>
                                      {subActive && (
                                        <motion.span
                                          layoutId="nested-sidebar-indicator"
                                          className="bg-primary absolute top-0 -left-4.25 h-full w-px"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                          }}
                                        />
                                      )}
                                      <span>{subItem.label}</span>
                                      {subItem?.new && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </motion.li>
                    );
                  })}
              </motion.ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

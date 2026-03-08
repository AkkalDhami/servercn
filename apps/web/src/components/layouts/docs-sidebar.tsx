"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";
import { motion } from "motion/react";
import { IRegistryItems } from "@/@types/registry";

import { cn } from "@/lib/utils";
import { getRegistryTypeItems } from "@/lib/source";
import CodeTheme from "@/components/docs/code-theme";
import { SelectFramework } from "@/components/docs/select-framework";
import { useFramework } from "@/store/use-framework";

const FRAMEWORK_SECTIONS = [
  "blueprints",
  "components",
  "foundations",
  "schemas"
];

export const ITEM_GROUP_NAMING = {
  guide: "Getting Started",
  foundation: "Foundations",
  tooling: "Tooling",
  component: "Components",
  blueprint: "Blueprints",
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
      items: getRegistryTypeItems("guide")
    },
    {
      title: ITEM_GROUP_NAMING.foundation,
      items: getRegistryTypeItems("foundation", framework)
    },
    {
      title: ITEM_GROUP_NAMING.tooling,
      items: getRegistryTypeItems("tooling") 
    },
    {
      title: ITEM_GROUP_NAMING.component,
      items: getRegistryTypeItems("component", framework)
    },
    {
      title: ITEM_GROUP_NAMING.blueprint,
      items: getRegistryTypeItems("blueprint", framework)
    },
    {
      title: ITEM_GROUP_NAMING.schema,
      items: getRegistryTypeItems("schema", framework)
    },
    {
      title: ITEM_GROUP_NAMING.contributing,
      items: getRegistryTypeItems("contributing") // Contributing doesn't filter by framework
    },
    {
      title: ITEM_GROUP_NAMING.page,
      items: PAGE_ITEMS
    }
  ];

  // Helper function to inject framework into URL if applicable
  const injectFramework = (url: string, itemType?: string): string => {
    if (!framework) return url;

    const segments = url.split("/").filter(Boolean);

    // Check if URL starts with /docs
    if (segments[0] !== "docs") return url;

    // Check if the section supports frameworks
    const section = segments[1];
    if (FRAMEWORK_SECTIONS.includes(section)) {
      // Remove existing framework if present
      if (segments[1] === "express" || segments[1] === "nestjs") {
        segments.splice(1, 1);
      }
      // Insert the stored framework
      segments.splice(1, 0, framework);
      return `/${segments.join("/")}`;
    }

    return url;
  };

  return (
    <nav className="no-scrollbar font-inter sticky top-18 left-0 z-10 h-full max-h-[calc(100vh-2rem)] w-full space-y-6 overflow-y-auto px-3 pb-14">
      <CodeTheme />
      <SelectFramework />

      {navSections.map(section => {
        if (!section.items.length) return null;

        return (
          <div key={section.title}>
            <h3 className="w-11/12 pb-4 text-sm font-[450] uppercase">
              {section.title}
            </h3>

            <ul className="mb-3 space-y-3.5 border-l border-zinc-200 dark:border-zinc-800">
              {(section.items as IRegistryItems[]).map((item, i: number) => {
                const itemUrl = injectFramework(item.url as string, item.type);
                // Check if current pathname matches the item (with or without framework)
                const isActive =
                  pathname === itemUrl ||
                  pathname.startsWith(`${itemUrl}/`) ||
                  pathname === item.url ||
                  pathname.startsWith(`${item.url}/`);

                const isNested =
                  item.type === "schema" || item.type === "blueprint";

                return (
                  <li key={`${item.slug + item.url}`}>
                    <Link
                      onClick={onLinkClickAction}
                      href={itemUrl as Route}
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

                      {section.title !== "Pages" &&
                        item.status !== "stable" && (
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
                                      "relative block text-sm capitalize transition-colors",
                                      subActive
                                        ? "text-accent-foreground font-medium"
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

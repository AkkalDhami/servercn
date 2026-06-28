"use client";

import { DISCORD_URL, GITHUB_URL } from "@/lib/constants";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { SearchCommand } from "@/components/command/search-command";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa6";
import { Route } from "next";
import { cn } from "@/lib/utils";
import { isActiveLink } from "./navbar";
import Logo from "./logo";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export function DesktopNav() {
  const grouppedNavLinks = [
    {
      label: "Docs",
      href: "/docs"
    },
    {
      label: "Registry",
      items: [
        {
          label: "Components",
          description: "Ready-to-use backend modules.",
          href: "/components"
        },
        {
          label: "Foundations",
          description: "Starter  project templates.",
          href: "/foundations"
        },
        {
          label: "Blueprints",
          description: "Production-ready feature modules.",
          href: "/blueprints"
        },
        {
          label: "Providers",
          description: "Database integrations.",
          href: "/providers"
        },
        {
          label: "Schemas",
          description: "Databse models & schemas.",
          href: "/schemas",
          newtab: false
        }
      ]
    },
    {
      label: "Community",
      items: [
        {
          label: "Contributing",
          description: "Help build the future of servercn.",
          href: "/contributing"
        },
        {
          label: "Contributors",
          description: "Meet our amazing contributors.",
          href: "/contributors",
          newtab: false
        },
        {
          label: "Stargazers",
          description: "See who starred on GitHub.",
          href: `${GITHUB_URL}/stargazers`,
          newtab: true
        },
        {
          label: "Discord",
          description: "Join our Discord community.",
          href: `${DISCORD_URL}`,
          newtab: true
        }
      ]
    },
    {
      label: "Changelog",
      href: "/docs/changelog"
    }
  ];

  const path = usePathname();
  return (
    <div>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background fixed top-0 left-0 z-40 hidden w-full pt-2 lg:block">
        <nav
          className={cn(
            "mx-auto flex max-w-368 items-center justify-between px-4 py-2.5",
            "border-edge border-x",
            "screen-line-before screen-line-after",
            "dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.08),transparent)]"
          )}>
          <div className="flex items-center gap-4">
            <Logo />

            <ul className="hidden items-center gap-3 lg:flex">
              {grouppedNavLinks.map(item => {
                const active = item.href && isActiveLink(path, item.href);

                if (!item.items) {
                  return (
                    <li key={item.label} className="relative">
                      <Link
                        href={item.href as Route}
                        className={cn(
                          "hover:text-foreground text-muted-foreground relative px-1 py-2 transition-colors",
                          active && "text-foreground"
                        )}>
                        {item.label}

                        {active && (
                          <motion.span
                            layoutId="nav-underline"
                            className="bg-foreground absolute bottom-0 left-0 h-px w-full"
                          />
                        )}
                      </Link>
                    </li>
                  );
                }

                const dropdownActive = item.items.some(i =>
                  isActiveLink(path, i.href)
                );

                return (
                  <li key={item.label} className="group relative">
                    <button
                      className={cn(
                        "hover:text-foreground text-muted-foreground flex items-center gap-1 rounded-md px-3 py-2 transition-colors",
                        dropdownActive && "text-foreground"
                      )}>
                      {item.label}

                      <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{
                          duration: 0.18,
                          ease: "easeOut"
                        }}
                        className="invisible absolute top-full left-0 mt-2 w-68 rounded-lg border bg-neutral-100 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:bg-neutral-900">
                        <div className="space-y-1 p-2">
                          {item.items.map(subItem => {
                            const active = isActiveLink(path, subItem.href);

                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href as Route}
                                target={subItem?.newtab ? "_blank" : undefined}
                                className={cn(
                                  "hover:bg-accent/70 hover:text-foreground flex rounded-lg px-3 py-2 transition-colors",
                                  active && "bg-accent/90 text-foreground"
                                )}>
                                <div>
                                  <p className="font-medium">{subItem.label}</p>
                                  <p className="text-muted-foreground text-sm">
                                    {subItem.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <SearchCommand />
            <ThemeToggle />

            <Button
              asChild
              size="icon"
              className="primary-ring"
              variant="secondary">
              <Link href={GITHUB_URL} target="_blank">
                <FaGithub className="size-5" />
              </Link>
            </Button>
          </div>
        </nav>
      </motion.header>
    </div>
  );
}

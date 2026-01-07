"use client";

import registry from "@/data/registry.json";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import SearchCommand from "../command/search-command";

const mapped = [...new Set(registry.items.map((item) => item.type))];

const navSections = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        url: "/docs/introduction",
      },
      {
        title: "Installation",
        url: "/docs/installation",
      },
      {
        title: "Project Structure",
        url: "/docs/project-structure",
      },
    ],
  },
  { 
    title: `${mapped[0]}s`,
    items: registry.items
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((item) => item.type == "component")
      .map((item) => ({
        title: item.title,
        url: item.docs,
      })),
  },
  {
    title: `${mapped[1]}s`,
    items: registry.items
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((item) => item.type == "blueprint")
      .map((item) => ({
        title: item.title,
        url: item.docs,
      })),
  },

];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar sticky top-18 left-0 z-10 h-full max-h-[calc(100vh-6rem)] w-full space-y-6 overflow-y-auto px-3">
      <SearchCommand />
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="relative z-10 w-11/12 pb-4 text-sm/6 font-[450] uppercase">
            {section.title}
          </h3>
          <ul className="mb-3 space-y-3.5 border-l border-zinc-200 dark:border-zinc-800">
            {section.items.map((item) => {
              const active = pathname === item.url;

              return (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className={cn(
                      "relative inline-flex items-center pl-4 text-base font-medium",
                      active
                        ? "text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <div className="bg-primary absolute top-0 -left-px z-1 h-full w-px" />
                    )}
                    <span className="">{item.title}</span>
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

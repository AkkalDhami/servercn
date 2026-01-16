"use client";

import * as React from "react";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";

import Link from "next/link";
import { Route } from "next";
import { CircleArrowRight, CircleCheckBig, CircleChevronRight, CircleDashed, CircleIcon } from "lucide-react";
import { getTypeItems } from "@/lib/source";
import { cn } from "@/lib/utils";
import { ITEM_GROUP_NAMING } from "../layouts/docs-sidebar";

export default function SearchCommand({ className, size }: { className?: string; size?: "sm" | "lg" }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const guideItems = getTypeItems("guide");
  const components = getTypeItems("component");
  const foundations = getTypeItems("foundation");
  const blueprints = getTypeItems("blueprint");
  const schemas = getTypeItems("schema");

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setOpen(open => !open)}
        className={cn("group hover:bg-card-hover px-2 py-0 sm:px-4 sm:py-2 md:space-x-1.5", className)}>
        <div className={cn("hidden items-center px-0 md:flex md:gap-2", size === "lg" ? "block" : "hidden")}>
          <span className="group-hover:text-accent-foreground text-muted-foreground font-normal duration-300">Search documentaion...</span>
        </div>

        <Kbd className="group-hover:text-accent-foreground text-muted-foreground text-sm font-medium duration-300">⌘ + J</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="dark:bg-background">
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {guideItems.length > 0 && (
            <CommandGroup heading={ITEM_GROUP_NAMING.guide.toUpperCase()}>
              {guideItems.map(item => (
                <CommandItem asChild key={item.title}>
                  <Link href={item.url as Route} onClick={() => setOpen(!open)} className="mb-0.5 w-full cursor-pointer">
                    <CircleArrowRight className="text-muted-secondary size-2.5" /> {item.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {foundations.length > 0 && (
            <CommandGroup heading={ITEM_GROUP_NAMING.foundation.toUpperCase()}>
              {foundations.map(item => (
                <CommandItem asChild key={item.title}>
                  <Link href={item.url as Route} onClick={() => setOpen(!open)} className="mb-0.5 w-full cursor-pointer">
                    <CircleCheckBig className="text-muted-secondary size-2.5" /> {item.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {components.length > 0 && (
            <CommandGroup heading={ITEM_GROUP_NAMING.component.toUpperCase()}>
              {components.map(item => (
                <CommandItem asChild key={item.title}>
                  <Link href={item.url as Route} onClick={() => setOpen(!open)} className="mb-0.5 w-full cursor-pointer">
                    <CircleIcon className="text-muted-secondary size-2.5" /> {item.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {blueprints.length > 0 && (
            <CommandGroup heading={ITEM_GROUP_NAMING.blueprint.toUpperCase()}>
              {blueprints.map(item => (
                <CommandItem asChild key={item.title}>
                  <Link href={item.url as Route} onClick={() => setOpen(!open)} className="mb-0.5 w-full cursor-pointer">
                    <CircleDashed className="text-muted-secondary size-2.5" /> {item.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {schemas.length > 0 && (
            <CommandGroup heading={ITEM_GROUP_NAMING.schema.toUpperCase()}>
              {schemas.map((item, i) => (
                <div key={item.slug} className="">
                  <h3 className="text-muted-foreground mt-2 pl-4 text-base">
                    {i + 1}. {item.title}
                  </h3>
                  <div className="mt-2 flex flex-col space-y-1">
                    {item.meta &&
                      item.meta?.models.length > 0 &&
                      item.meta?.models.map(i => (
                        <CommandItem asChild key={i.slug}>
                          <Link href={i.slug as Route} onClick={() => setOpen(!open)} className="cursor-pointer pl-4 capitalize">
                            <CircleChevronRight className="text-muted-secondary size-2.5" /> {i.label} Schema
                          </Link>
                        </CommandItem>
                      ))}
                  </div>
                </div>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}

"use client";

import { ItemType } from "@/@types/registry";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { CurlyBraces } from "lucide-react";

type ViewAsJsonProps = {
  type: ItemType;
  slug: string;
};

export function ViewAsJson({ slug, type }: ViewAsJsonProps) {
  return (
    <Link href={`/sr/${type}/${slug}.json` as Route} target="_blank" className={cn(buttonVariants({variant: "outline"}), "flex items-center gap-2")}>
    <CurlyBraces className="size-4"/>  View as Json
    </Link>
  );
}

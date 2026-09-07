"use client";

import { IRegistryItems } from "@/@types/registry";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";

export function ItemWithDBCard({ item }: { item: IRegistryItems }) {
  return (
    <div
      className={cn(
        "hover:bg-card-hover screen-line-before border-edge flex flex-col gap-2 p-4 duration-300 last:border-r",
        item.status !== "stable" && "pointer-events-none",
        "dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)]"
      )}>
      <Link
        href={(item.status === "stable" ? item.url : "") as Route}
        className="flex items-center gap-3 text-lg duration-300 hover:underline">
        {item.title}

        {item.status !== "stable" && (
          <>
            <span
              className={`absolute top-4 right-4 hidden rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 md:block dark:border-amber-600`}>
              upcoming
            </span>
            <span
              className={`absolute top-4 right-4 block size-2 rounded-full bg-amber-500 md:hidden`}></span>
          </>
        )}
        {item.meta?.new && (
          <span className={`size-2 rounded-full bg-blue-500`} />
        )}
      </Link>
      <p className="text-muted-primary line-clamp-2 text-base">
        {item.description}
      </p>

      {item.meta?.databases && (
        <ul className="space-y-3 pl-1">
          {item.meta.databases.map((database, index) => {
            const modelPath = `/docs/${database.slug}`;
            return (
              <li key={database.slug}>
                <Link
                  href={modelPath as Route}
                  className={cn(
                    "relative flex items-center gap-3 capitalize underline underline-offset-2 transition-colors",
                    "text-muted-secondary hover:text-primary"
                  )}>
                  {index + 1}. {database.label}
                  {database?.new && (
                    <span className={`size-2 rounded-full bg-blue-500`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="text-muted-primary mt-2 flex items-center text-sm font-medium">
        {item?.frameworks?.map((framework: string) => framework).join(" | ")}
      </div>
    </div>
  );
}

import { IRegistryItems } from "@/@types/registry";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";

export default function ComponentCard({
  component
}: {
  component: IRegistryItems;
}) {
  const isStable = ["stable", "deprecated"].includes(component.status);

  return (
    <Link
      href={(isStable ? component.url : "") as Route}
      className={cn(
        "group border-edge hover:bg-card-hover screen-line-before relative p-4 duration-300 last:border-r",
        !isStable && "pointer-events-none",
        "dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)]"
      )}>
      {component.status !== "stable" && (
        <>
          <span
            className={`absolute top-4 right-4 size-2 rounded-full bg-amber-500`}></span>
        </>
      )}
      <div className="flex items-center gap-4">
        <h3 className="text-lg underline-offset-4 group-hover:underline">
          {component.title}
        </h3>
        {component.meta?.new && (
          <span className={`size-2 rounded-full bg-blue-500`} />
        )}
      </div>

      <p className="text-muted-primary mt-2 line-clamp-2 text-sm">
        {component.description}
      </p>

      <div className="text-muted-primary mt-4 flex items-center text-sm font-medium">
        {component?.frameworks
          ?.map((framework: string) => framework)
          .join(" | ")}
      </div>
    </Link>
  );
}

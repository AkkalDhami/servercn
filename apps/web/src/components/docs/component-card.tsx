import { IRegistryItems } from "@/@types/registry";
import { Route } from "next";
import Link from "next/link";

export default function ComponentCard({
  component
}: {
  component: IRegistryItems;
}) {
  return (
    <Link
      href={component.url as Route}
      className="group last:border-r border-edge hover:bg-card-hover screen-line-before relative p-4 duration-300">
      {component.status !== "stable" && (
        <>
          <span
            className={`absolute top-4 right-4 hidden rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 md:block dark:border-amber-600`}>
            {component.status}
          </span>
          <span
            className={`absolute top-4 right-4 block size-2 rounded-full bg-amber-500 md:hidden`}></span>
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

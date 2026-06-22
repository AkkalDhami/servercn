"use client";

import { useMemo } from "react";
import ComponentCard from "@/components/docs/component-card";
import { getRegistryTypeItems } from "@/lib/source";
import { useFramework } from "@/store/use-framework";
import { ItemType } from "@/@types/registry";
import { ItemWithDBCard } from "./schema-card";

export function ComponentsCatalog({ type }: { type: ItemType }) {
  const { framework } = useFramework();

  const components = useMemo(
    () => getRegistryTypeItems(type, framework),
    [framework, type]
  );

  return (
    <>
      <div className="screen-line-after &>*]:border grid divide-x sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(3n)]:border-r-0 [&>*:nth-child(3n+1)]:border-l-0">
        {components
          .filter(c => c.status !== "experimental")
          .map(component =>
            ["blueprint", "schema"].includes(type) ? (
              <ItemWithDBCard key={component.slug} item={component} />
            ) : (
              <ComponentCard key={component.slug} component={component} />
            )
          )}
      </div>

      <div className="mt-6 flex items-center justify-end px-4">
        <p className="text-muted-foreground">
          Total {type}s: {components.length}
        </p>
      </div>
    </>
  );
}

import { BackendComponent } from "@/app/(app)/components/page";
import { Route } from "next";
import Link from "next/link";

export default function ComponentCard({ component }: { component: BackendComponent }) {
  return (
    <Link href={component.docs as Route} className="group bg-background border-hover hover:bg-card-hover relative rounded-xl border p-5">
      {component.status !== "stable" && (
        <span
          className={`absolute top-4 right-4 rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:border-amber-600`}>
          {component.status}
        </span>
      )}
      <h3 className="text-lg font-medium">{component.title}</h3>

      <p className="text-muted-primary mt-2 line-clamp-2 text-sm">{component.description}</p>

      <div className="text-muted-secondary group-hover:text-foreground mt-4 flex items-center text-sm font-medium duration-300 group-hover:underline">
        View docs
      </div>
    </Link>
  );
}

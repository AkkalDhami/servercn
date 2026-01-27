import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <section
      id="cta"
      className="bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)] dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.08),transparent)] relative mx-auto mb-18 flex w-full max-w-3xl flex-col justify-between gap-y-4 border-y px-4 py-20">
      <PlusIcon
        className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6"
        strokeWidth={1}
      />

      <div className="pointer-events-none absolute -inset-y-6 left-0 w-px border-l" />
      <div className="pointer-events-none absolute -inset-y-6 right-0 w-px border-r" />

      <div className="absolute top-0 left-1/2 -z-10 h-full border-l border-dashed" />

      <h2 className="text-center text-xl font-semibold text-balance md:text-3xl">
        Stop building from scratch. Start building with ServerCN.
      </h2>
      <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base">
        Add production-ready, modular backend components, schemas and blueprints
        to your Express project with a single command. Own your code, no
        dependencies, no lock-in.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Button variant={"outline"} asChild>
          <Link href="/components">Browse Components</Link>
        </Button>
        <Button asChild>
          <Link href="/docs/installation" className="flex items-center gap-2">
            Get Started <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function CallToAction() {
  return (
    <Section id="cta" className="">
      <div className="bg-primary/5 relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-4 rounded-xl py-10">
        <h2 className="text-center text-xl font-semibold text-balance md:text-4xl">
          Stop building backends from scratch. Start building with ServerCN.
        </h2>
        <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base">
          Add production-ready, modular backend components, schemas and
          blueprints to your Express project with a single command. Own your
          code, no dependencies, no lock-in.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant={"outline"}
            asChild
            className="bg-transparent dark:bg-transparent">
            <Link href="/components">Browse Components</Link>
          </Button>
          <Button asChild>
            <Link href="/docs/installation" className="flex items-center gap-2">
              Get Started <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

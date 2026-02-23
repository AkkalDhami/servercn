import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <section
      id="cta"
      className="bg-muted relative mx-auto mb-18 flex w-full max-w-3xl flex-col justify-between gap-y-4 rounded-xl px-4 py-20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-radius-top-left absolute -inset-1">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 19v-6a8 8 0 0 1 8 -8h6" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-radius-top-left text-muted-secondary absolute -inset-1">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 19v-6a8 8 0 0 1 8 -8h6" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-radius-top-right text-muted-secondary absolute -top-1 -right-1">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 5h6a8 8 0 0 1 8 8v6" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-radius-bottom-left text-muted-secondary absolute -bottom-1 -left-1">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19 19h-6a8 8 0 0 1 -8 -8v-6" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-radius-bottom-right text-muted-secondary absolute -right-1 -bottom-1">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19 5v6a8 8 0 0 1 -8 8h-6" />
      </svg>

      <h2 className="text-center text-xl font-semibold text-balance md:text-3xl">
        Stop building from scratch. Start building with ServerCN.
      </h2>
      <p className="text-muted-foreground text-center text-sm font-medium text-balance md:text-base">
        Add production-ready, modular backend components, schemas and blueprints
        to your Express project with a single command. Own your code, no
        dependencies, no lock-in.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Button variant={"outline"} asChild className="bg-transparent">
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, TerminalIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation
} from "@/components/ui/terminal";
export default function CallToAction() {
  return (
    <Section
      id="cta"
      className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="relative mx-auto flex w-full flex-col justify-between gap-y-4 rounded-xl py-4">
        <h2 className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
          Build your backend faster with Servercn.
        </h2>
        <p className="text-muted-foreground text-base font-medium text-balance md:text-lg">
          Add production-ready, modular backend components, schemas and
          blueprints to your Express project with a single command. Own your
          code, no dependencies, no lock-in.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant={"outline"}
            asChild
            className="bg-transparent dark:bg-transparent">
            <Link href="/components">Browse Components</Link>
          </Button>
          <Button asChild>
            <Link href="/docs/installation" className="flex items-center gap-2">
              <TerminalIcon className="size-4" />
              Get Started
            </Link>
          </Button>
        </div>
      </div>

      <Terminal
        command="npx servercn-cli init"
        className="mx-auto h-full min-h-60 w-full overflow-x-hidden md:min-w-xl">
        <TypingAnimation className="text-base">$ npx servercn-cli init</TypingAnimation>
        {[
          "Select a project foundation:",
          "> Express Starter",
          "  Express + Mongoose",
          "  Express + MySQL (Drizzle)",
          "  Express + PostgreSQL (Drizzle)",
          "  Express + PostgreSQL (Drizzle)",
          "  Existing Project"
        ].map((file, index) => (
          <AnimatedSpan key={index} delay={index * 50} className="text-sm">
            <p>{file}</p>
          </AnimatedSpan>
        ))}
      </Terminal>
    </Section>
  );
}

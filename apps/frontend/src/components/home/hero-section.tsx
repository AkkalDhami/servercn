import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "../ui/text-effect";
import { AnimatedGroup } from "../ui/animated-group";
import { FaGithub } from "react-icons/fa";
import { HeaderBadge } from "../ui/header-badge";
import InitCopyButton from "./init-copy-button";
import { FlipWords } from "../ui/flip-words";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="relative pt-18 pb-20 md:pt-22 md:pb-28">
        <div className="mx-auto max-w-6xl space-y-5 px-6">
          {/* Badge */}
          <div className="flex justify-center">
            <HeaderBadge className="py-1">
              <Sparkles className="size-3" />
              Build faster with composable backends
            </HeaderBadge>
          </div>

          <div className="text-center">
            {/* <h1 className="mx-auto max-w-4xl leading-tight text-center text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Build backends{" "}
              <FlipWords words={["faster", "scalable", "faster"]} /> with
              ServerCN
            </h1> */}

            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.25}
              as="h1"
              className="mx-auto max-w-3xl text-center text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl"
            >
              Build backends faster with ServerCN
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.4}
              as="p"
              className="text-muted-primary mx-auto mt-10 max-w-2xl text-lg tracking-tight md:text-xl"
            >
              ServerCN , the backend component registry for Node.js inspired by
              shadcn/ui. ServerCN standardizes backend patterns so you can focus
              on business logic, not boilerplate.
            </TextEffect>

            <AnimatedGroup className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                key={1}
                asChild
                size="lg"
                variant="default"
                className="shadow-primary/20 hover:shadow-primary/30 h-12 px-8 text-base shadow-lg"
              >
                <Link href="/docs" className="flex items-center gap-2">
                  <span>Start Building</span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
              <Button
                key={2}
                asChild
                size="lg"
                variant="outline"
                className="hover:bg-card-hover h-12 gap-2 border-2 px-8 text-base"
              >
                <Link
                  href="https://github.com/akkaldhami/servercn"
                  target="_blank"
                  className="flex items-center"
                >
                  <FaGithub className="size-5" />
                  <span>Star on GitHub</span>
                </Link>
              </Button>
            </AnimatedGroup>
            <div className="mt-12 flex items-center justify-center">
              <InitCopyButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

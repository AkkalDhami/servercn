"use client";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "../ui/animated-group";
import { FaGithub } from "react-icons/fa";
import { HeaderBadge } from "../ui/header-badge";
import InitCopyButton from "./init-copy-button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="relative pt-18 pb-20 md:pt-22 md:pb-28">
        <div className="mx-auto max-w-6xl sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden justify-center sm:flex">
            <HeaderBadge className="px-0 py-1 pl-3 text-sm">
              <Link href={"/docs"} className="flex items-center gap-2">
                <span>Build backends by composition, not boilerplate</span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </HeaderBadge>
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-inter mx-auto max-w-3xl text-center text-5xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
              Build backends faster with ServerCN
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-muted-primary mx-auto mt-6 max-w-2xl text-lg leading-relaxed tracking-tight md:text-xl">
              ServerCN is a{" "}
              <span className="text-accent-foreground font-medium">
                component registry
              </span>{" "}
              for building{" "}
              <span className="text-accent-foreground font-medium">
                production-ready
              </span>{" "}
              <span className="text-accent-foreground font-medium">
                Node.js backends
              </span>{" "}
              by composition, inspired by shadcn/ui. ServerCN standardizes
              backend patterns so you can focus on business logic, not
              boilerplate.
            </motion.div>

            <AnimatedGroup className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                key={1}
                asChild
                size="lg"
                variant="default"
                className={cn(
                  "hover:shadow-primary shadow-primary/20 hover:shadow-primary/30 text-base shadow-none",
                  "h-10 px-1 sm:h-12 sm:px-6"
                )}>
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
                className={cn(
                  "hover:bg-card-hover hover:shadow-tertiary h-9 gap-2 border-2 px-1 text-base shadow-none",
                  "h-10 px-2 sm:h-12 sm:px-8"
                )}>
                <Link
                  href="https://github.com/akkaldhami/servercn"
                  target="_blank"
                  className="flex items-center">
                  <FaGithub className="size-5" />
                  <span>Star on GitHub</span>
                </Link>
              </Button>
            </AnimatedGroup>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex items-center justify-center">
              <InitCopyButton />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

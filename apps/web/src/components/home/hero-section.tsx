"use client";
import Link from "next/link";
import { ArrowRight, LucideTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { FaGithub } from "react-icons/fa";
import { HeaderBadge } from "@/components/ui/header-badge";
import InitCopyButton from "./init-copy-button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { GITHUB_URL } from "@/lib/constants";
import DemoVideo from "./demo";

export default function HeroSection() {
  return (
    <section id="hero" className="relative mt-4 overflow-hidden sm:mt-12">
      <div className="relative pt-18 pb-20 sm:px-4 md:pt-22 md:pb-28">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="sm:max-w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden sm:inline-block">
              <HeaderBadge className="bg-background px-0 py-1 pl-3 text-sm shadow-none">
                <Link
                  href={"/docs/installation"}
                  className="bg-background flex items-center gap-2">
                  <span>The shadcn philosophy for Node.js backends</span>
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

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-inter text-primary text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Ship backends faster than ever
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-muted-primary mt-6 text-lg leading-relaxed tracking-tight md:text-xl">
                Focus on logic, not setup. Pick the components you need — oauth,
                JWT, rate limiting, logging, file-uploading, email-service and
                more. Drop them into your Express project. You own every line,
                zero lock-in.
              </motion.div>

              <AnimatedGroup className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                <Button
                  key={1}
                  asChild
                  variant="default"
                  className={cn(
                    "hover:shadow-primary shadow-primary/20 hover:shadow-primary/30 text-base shadow-none",
                    "h-10 px-1 sm:h-11 sm:w-40 sm:px-8"
                  )}>
                  <Link href="/docs" className="flex items-center gap-2">
                    <LucideTerminal className="size-4" />
                    <span>Get Started</span>
                  </Link>
                </Button>
                <Button
                  key={2}
                  asChild
                  variant="outline"
                  className={cn(
                    "hover:shadow-tertiary h-9 gap-2 px-1 text-base",
                    "h-10 px-2 sm:h-11 sm:w-40 sm:px-8"
                  )}>
                  <Link
                    href={GITHUB_URL}
                    target="_blank"
                    className="flex items-center">
                    <FaGithub className="size-5" />
                    <span>Star on GitHub</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border">
            <DemoVideo />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex items-center justify-center sm:mt-10">
          <InitCopyButton />
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { LucideTerminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { FaGithub } from "react-icons/fa";
import InitCopyButton from "./init-copy-button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { GITHUB_URL } from "@/lib/constants";
import { LanguageIcons } from "@/components/docs/icons/language-icons";

const supportedStack = [
  {
    name: "Node.js",
    icon: LanguageIcons.nodejs
  },
  {
    name: "Express.js",
    icon: LanguageIcons.expressjs
  },
  {
    name: "TypeScript",
    icon: LanguageIcons.ts
  },
  {
    name: "MongoDB",
    icon: LanguageIcons.mongodb
  },

  {
    name: "MySQL",
    icon: LanguageIcons.mysql
  },
  {
    name: "PostgreSQL",
    icon: LanguageIcons.pg
  },
  {
    name: "Drizzle",
    icon: LanguageIcons.drizzle
  },
  {
    name: "Prisma",
    icon: LanguageIcons.prisma
  },

  {
    name: "Next.js",
    icon: LanguageIcons.nextjs
  }
];

export default function HeroSection() {
  return (
    <section id="hero" className={cn("relative mt-4 overflow-hidden sm:mt-12")}>
      <div className="relative pt-18 pb-20 sm:px-4 md:pt-22 md:pb-28">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="md:max-w-1/2">
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
                <span className="text-primary font-medium">
                  Focus on logic, not setup.
                </span>{" "}
                Pick the components you need — oauth, JWT, rate limiting,
                logging, file-uploading, email-service and more. Drop them into
                your Express project. You own every line, zero lock-in.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex flex-wrap items-center gap-3">
                {supportedStack.map(stack => (
                  <Tooltip key={stack.name}>
                    <TooltipTrigger className="cursor-pointer">
                      <div className="flex items-center justify-center rounded-lg px-2 py-1">
                        <stack.icon className="size-8" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-base font-medium">{stack.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
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
                    "hover:shadow-tertiary primary-ring h-9 gap-2 px-1 text-base",
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
            <video controls autoPlay>
              <source src="/demo.mp4" autoFocus type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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

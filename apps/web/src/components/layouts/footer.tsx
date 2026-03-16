"use client";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import Logo from "./logo";
import { getRegistryTypeItems } from "@/lib/source";
import Link from "next/link";
import { Route } from "next";
import { GiCrossedAxes } from "react-icons/gi";
import {
  APP_NAME,
  BASE_GITHUB_URL,
  DISCORD_URL,
  GITHUB_URL
} from "@/lib/constants";
import { cn } from "@/lib/utils";
type FooterLink = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type FooterLinkGroup = {
  label: string;
  links: FooterLink[];
};

export default function Footer() {
  return (
    <footer
      className={cn(
        "bg-background relative z-10 w-full max-w-svw overflow-x-hidden pt-0 pb-8"
      )}>
      <div
        className={cn(
          "relative mx-auto w-full max-w-360 py-4",
          "screen-line-before screen-line-after",
          "border-edge border-x"
        )}>
        <div className="relative flex size-full flex-col justify-between gap-5">
          <div className="flex flex-col gap-4 px-4 sm:gap-8 md:flex-row">
            <AnimatedContainer className="w-full max-w-sm min-w-2xs space-y-4">
              <Logo />
              <p className="text-muted-foreground mt-8 text-sm">
                {APP_NAME} , the backend component registry for node.js inspired
                by shadcn/ui.
              </p>
            </AnimatedContainer>
            {footerLinkGroups.map((group, index) => (
              <AnimatedContainer
                className="w-full"
                delay={0.1 + index * 0.1}
                key={group.label}>
                <div className="mb-10 md:mb-0">
                  <h3 className="text-sm font-medium uppercase">
                    {group.label}
                  </h3>
                  <ul className="text-muted-foreground md:text-s mt-4 space-y-2 text-sm lg:text-sm">
                    {group.links.map(link => (
                      <li key={link.title}>
                        <Link
                          className="hover:text-foreground inline-flex items-center transition-all duration-300"
                          href={link.href as Route}>
                          {link.icon && <link.icon className="me-1 size-4" />}
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          <p className="screen-line-before mask-b-from-0.5 pt-6 text-center text-5xl font-bold tracking-widest text-neutral-300 uppercase sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl dark:text-neutral-700">
            SERVERCN
          </p>

          <div className="text-muted-foreground screen-line-before relative flex flex-col items-center justify-between gap-2 px-4 pt-4 text-sm md:flex-row">
            <p className="capitalize">
              &copy; {new Date().getFullYear()} | {APP_NAME} | All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              Built with <Weapon /> by
              <Link
                className="hover:text-foreground underline"
                href={BASE_GITHUB_URL}
                target="_blank">
                Akkal Dhami
              </Link>
              and the{" "}
              <Link
                className="hover:text-foreground underline"
                href={"/contributors"}
                target="_blank">
                Contributors
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="hover:text-foreground underline"
                href={GITHUB_URL}
                target="_blank">
                Github
              </Link>
              <Link
                className="hover:text-foreground underline"
                href={DISCORD_URL}
                target="_blank">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const components = getRegistryTypeItems("component", "express");
export const foundations = getRegistryTypeItems("foundation", "express");
export const blueprints = getRegistryTypeItems("blueprint", "express");
export const models = getRegistryTypeItems("schema", "express");

const footerLinkGroups: FooterLinkGroup[] = [
  {
    label: "Quick Links",
    links: [
      {
        title: "Home",
        href: "/"
      },
      {
        title: "Documents",
        href: "/docs"
      },
      {
        title: "Components",
        href: "/components"
      },
      {
        title: "Foundations",
        href: "/foundations"
      },
      {
        title: "Blueprints",
        href: "/blueprints"
      },
      {
        title: "Contributing",
        href: "/contributing"
      },
      {
        title: "Contributors",
        href: "/contributors"
      },
      { title: "Models", href: "/models" },
      { title: "GitHub", href: "https://github.com/akkaldhami/servercn" }
    ]
  },
  {
    label: "Components",
    links: [
      { title: "All Components", href: "/components" },
      ...components
        .filter(item => item.status === "stable")
        .map(item => ({
          title: item.title,
          href: `${item.url}`
        }))
    ]
  },
  {
    label: "Foundations",
    links: [
      { title: "All Foundations", href: "/foundations" },
      ...foundations.map(item => ({
        title: item.title,
        href: `${item.url}`
      }))
    ]
  },
  {
    label: "Blueprints",
    links: [
      { title: "All Blueprints", href: "/blueprints" },
      ...blueprints.map(item => ({
        title: item.title,
        href: `${item.url}`
      }))
    ]
  },
  {
    label: "Schemas",
    links: [
      { title: "All Schemas", href: "/schemas" },
      ...models.map(item => ({
        title: item.title,
        href: `${item.url}`
      }))
    ]
  }
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
  children?: React.ReactNode;
  delay?: number;
};

function AnimatedContainer({
  delay = 0.1,
  children,
  ...props
}: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      {...props}>
      {children}
    </motion.div>
  );
}

function Weapon() {
  return (
    <div className="relative flex items-center gap-2">
      <GiCrossedAxes className="size-4" />
    </div>
  );
}

"use client";
import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import Logo from "./logo";
import { getTypeItems } from "@/lib/source";
import Link from "next/link";
import { Route } from "next";
import { TextHoverEffect } from "../ui/text-hover-effect";
import { GiBowieKnife } from "react-icons/gi";
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
    <footer className="font-inter relative mt-8 w-full border-t">
      <div className="w-full">
        <div className="relative flex size-full flex-col justify-between gap-5 px-4">
          <div
            aria-hidden
            className="absolute inset-0 isolate z-0 opacity-50 contain-strict dark:opacity-100">
            <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
          </div>
          <div className="flex flex-col gap-4 pt-12 sm:gap-8 md:flex-row">
            <AnimatedContainer className="w-full max-w-sm min-w-2xs space-y-4">
              <Logo />
              <p className="text-muted-foreground mt-8 text-sm md:mt-4">
                ServerCN , the backend component registry for Node.js inspired
                by shadcn/ui. ServerCN standardizes backend patterns so you can
                focus on business logic, not boilerplate.
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

          <div className="relative mt-10 mask-b-from-5%">
            <TextHoverEffect text="SERVERCN" automatic={true} />
          </div>

          <div className="text-muted-foreground relative flex flex-col items-center justify-between gap-2 border-t py-4 text-sm md:flex-row">
            <div className="via-muted-secondary/40 absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent to-transparent"></div>
            <p>
              &copy; {new Date().getFullYear()} ServerCN | All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              Built with <Weapon /> by
              <Link
                className="hover:text-foreground underline"
                href="https://github.com/akkaldhami"
                target="_blank">
                Akkal Dhami
              </Link>
            </div>
            <Link
              className="hover:text-foreground underline"
              href="https://github.com/akkaldhami/servercn"
              target="_blank">
              Github
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const components = getTypeItems("component");
const foundations = getTypeItems("foundation");
const blueprints = getTypeItems("blueprint");
const models = getTypeItems("schema");

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
      <GiBowieKnife className="absolute size-4" />
      <GiBowieKnife className="size-4 rotate-90 transform" />
    </div>
  );
}

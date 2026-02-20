"use client";

import { Button } from "@/components/ui/button";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/lib/config";
import SearchCommand from "../command/search-command";
import { Route } from "next";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GITHUB_URL } from "@/lib/constants";

const links = siteConfig.navItems;

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escaped}(/|$)`);

  return regex.test(pathname);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-background fixed top-0 left-0 z-40 w-full">
        <nav className="mx-auto flex max-w-368 items-center justify-between px-4 py-2 md:py-3">
          <Logo />

          <ul className="hidden items-center gap-4 md:flex">
            {links.map(link => {
              const active = isActiveLink(path, link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href as Route}
                    className={cn(
                      "text-muted-foreground hover:text-foreground font-medium transition-colors",
                      active && "text-foreground"
                    )}>
                    {link.label}
                  </Link>

                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="bg-foreground absolute -bottom-1 left-0 h-px w-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <SearchCommand />
            <ThemeToggle />

            <Button
              asChild
              size="icon"
              className="hidden md:flex"
              variant="secondary">
              <Link href={GITHUB_URL} target="_blank">
                <FaGithub className="size-4" />
              </Link>
            </Button>

            <Button
              onClick={() => setOpen(prev => !prev)}
              variant="outline"
              className="px-2 py-1 md:hidden">
              <motion.div
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.2 }}>
                <MenuIcon className="text-accent-foreground size-5" />
              </motion.div>
            </Button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <MobileNavbar onClose={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="bg-muted/70 fixed inset-0 z-40 h-full w-full"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavbar({ onClose }: { onClose: () => void }) {
  const path = usePathname();

  return (
    <motion.aside
      initial={{
        x: "100%"
      }}
      animate={{
        x: 0
      }}
      exit={{
        x: "100%"
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25
      }}
      className="bg-background/90 fixed top-0 right-0 z-50 h-full w-90 backdrop-blur-md md:hidden">
      <Button
        variant="secondary"
        onClick={onClose}
        className="absolute top-4 right-3">
        <X />
      </Button>

      <ul className="mt-16 flex flex-col space-y-5 px-12 pl-6">
        {links.map((link, index) => (
          <motion.li
            key={link.href}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 }}>
            <Link
              href={link.href as Route}
              onClick={onClose}
              className={cn(
                "text-muted-foreground hover:text-foreground text-2xl font-semibold transition-colors",
                path === link.href &&
                  "text-foreground underline underline-offset-5"
              )}>
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
      <div className="absolute right-2 bottom-4 flex w-full items-center gap-3 px-6">
        <div className="flex-1">
          <SearchCommand size="lg" />
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size="icon" variant="secondary">
            <Link href="https://github.com/akkaldhami" target="_blank">
              <FaGithub className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </motion.aside>
  );
}

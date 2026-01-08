"use client";
import { Button } from "../ui/button";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { siteConfig } from "@/lib/config";
import SearchCommand from "../command/search-command";
import { Route } from "next";
import { cn } from "@/lib/utils";
import {  usePathname } from "next/navigation";
const links = siteConfig.navItems;
export default function Navbar() {
  const path = usePathname();
  console.log(path);
  return (
    <header className="bg-background fixed top-0 left-0 z-40 w-full">
      <nav className="mx-auto flex max-w-368 items-center justify-between px-4 py-2 md:py-3">
        <Logo />
        <ul className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as Route}
                className={cn("text-muted-foreground hover:text-foreground", path.includes(link.href) && "text-foreground")}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <SearchCommand />

          <ThemeToggle />
          <Button asChild size={"icon"} variant={"secondary"}>
            <Link href="https://github.com/akkaldhami" target="_blank">
              <FaGithub className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFramework } from "@/store/use-framework";
import { Route } from "next";

const FRAMEWORK_SECTIONS = [
  "blueprints",
  "components",
  "foundations",
  "schemas"
];

/**
 * Client component that redirects to framework-prefixed URL
 * based on user's stored framework preference
 */
export function FrameworkRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { framework } = useFramework();

  useEffect(() => {
    // Only run on client side after hydration
    if (typeof window === "undefined") return;

    // Don't redirect if no framework preference is set
    if (!framework) return;

    const segments = pathname.split("/").filter(Boolean);

    // Check if we're on a docs page
    if (segments[0] !== "docs") return;

    // Check if framework is already in URL
    if (segments[1] === "express" || segments[1] === "nestjs") {
      // Framework already in URL
      // If it matches the stored framework, no redirect needed
      if (segments[1] === framework) return;

      // If it doesn't match, update the stored framework to match URL
      // This syncs the store with the URL
      return;
    }

    // Check if the current section supports frameworks
    const section = segments[1];
    if (!FRAMEWORK_SECTIONS.includes(section)) {
      // This section doesn't support frameworks
      return;
    }

    // Build new URL with framework
    segments.splice(1, 0, framework);
    const newPath = `/${segments.join("/")}`;

    // Only redirect if the path actually changed
    if (newPath !== pathname) {
      router.replace(newPath as Route);
    }
  }, [pathname, framework, router]);

  return null;
}

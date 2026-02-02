"use client";

import { useEffect, useState } from "react";
import GithubSlugger from "github-slugger";
import { cn } from "@/lib/utils";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function OnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById("docs-content");
    console.log({ container });
    if (!container) return;

    const slugger = new GithubSlugger();

    const elements = Array.from(
      container.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[];

    const list: Heading[] = elements
      .map(el => {
        const text = el.textContent?.trim() ?? "";
        if (!text) return null;

        const id = el.id || slugger.slug(text);
        el.id = id;

        return {
          id,
          text,
          level: Number(el.tagName[1])
        };
      })
      .filter(Boolean) as Heading[];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(list);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-96px 0px -60% 0px",
        threshold: 0
      }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden w-56 md:block">
      <h4 className="mb-2 text-sm font-semibold">On This Page</h4>

      <ul className="space-y-2 text-sm">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 16}px` }}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block transition-colors",
                activeId === h.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

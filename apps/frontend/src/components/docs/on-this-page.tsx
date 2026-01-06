"use client";

import { useEffect, useState } from "react";
import GithubSlugger from "github-slugger";
import clsx from "clsx";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function OnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const slugger = new GithubSlugger();
    const elements = Array.from(
      document.querySelectorAll("h2, h3.this-page-link"),
    ) as HTMLHeadingElement[];

    const list = elements.map((el) => {
      const text = el.textContent ?? "";
      const id = el.id || slugger.slug(text);
      el.id = id;

      return {
        id,
        text,
        level: Number(el.tagName[1]),
      };
    });

    setHeadings(list);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    headings.forEach((h) => {
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
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 16}px` }}>
            <a
              href={`#${h.id}`}
              className={clsx(
                "block transition-colors",
                activeId === h.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

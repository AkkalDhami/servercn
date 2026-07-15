"use client";

import { SERVERCN_URL } from "@/lib/constants";
import { useEffect } from "react";

export function ExternalLinkProvider() {
  useEffect(() => {
    const addUTM = (anchor: HTMLAnchorElement) => {
      try {
        const url = new URL(anchor.href);

        if (
          url.hostname !== window.location.hostname &&
          !url.searchParams.has("utm_source")
        ) {
          url.searchParams.set(
            "utm_source",
            SERVERCN_URL.replace("https://", "")
          );

          anchor.href = url.toString();
        }
      } catch {}
    };

    const processLinks = () => {
      document.querySelectorAll("a").forEach(anchor => addUTM(anchor));
    };

    processLinks();

    const observer = new MutationObserver(processLinks);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

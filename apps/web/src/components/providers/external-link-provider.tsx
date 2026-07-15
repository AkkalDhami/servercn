"use client";

import { SERVERCN_URL } from "@/lib/constants";
import { useEffect } from "react";

export function ExternalLinkProvider() {
  useEffect(() => {
    const links = document.querySelectorAll("a");

    links.forEach(anchor => {
      const href = anchor.href;

      try {
        const url = new URL(href);

        if (
          url.hostname !== window.location.hostname &&
          !url.searchParams.has("utm_source")
        ) {
          url.searchParams.set("utm_source", SERVERCN_URL.replace("https://", ""));

          anchor.href = url.toString();
        }
      } catch {}
    });
  }, []);

  return null;
}

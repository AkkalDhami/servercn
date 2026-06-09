"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextSessionProvider>
      {children}
    </NextSessionProvider>
  );
}

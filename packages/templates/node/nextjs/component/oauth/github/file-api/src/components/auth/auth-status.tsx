"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function AuthStatus() {
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <Link
        href="/signin"
        className="rounded-full border border-neutral-400 bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300">
        Sign In
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        signOut();
      }}
      className="h-10 cursor-pointer rounded-full bg-neutral-50 px-4 font-medium text-black">
      Sign Out
    </button>
  );
}

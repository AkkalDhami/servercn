"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export function ProfileCard() {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session.status !== "authenticated") {
    return redirect("/signin");
  }

  if (!session.data?.user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const { user } = session.data;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-white">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name || ""}
          className="h-24 w-24 rounded-full"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full bg-neutral-50 text-2xl text-black">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}

      <h1 className="text-3xl font-bold">{user.name}</h1>
      <div className="flex items-center gap-2">
        <p className="text-neutral-400">{user.email}</p>
      </div>
    </div>
  );
}

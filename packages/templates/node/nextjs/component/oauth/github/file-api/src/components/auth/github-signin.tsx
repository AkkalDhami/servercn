"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function GitHubSignin() {
  const session = useSession();

  if (session.status === "authenticated") {
    return redirect("/");
  }

  return (
    <div className={"mt-4 flex flex-col items-center justify-center"}>
      <h3 className="text-xl font-medium text-white uppercase">
        Continue with
      </h3>
      <div className="mt-3 w-50">
        <button
          className={
            "relative flex w-full cursor-pointer items-center justify-center gap-5 rounded-full bg-white px-4 py-3"
          }
          onClick={() =>
            signIn("github", {
              callbackUrl: "/"
            })
          }
          type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 64 64">
            <path
              fill="currentColor"
              d="M32 0C14 0 0 14 0 32c0 21 19 30 22 30c2 0 2-1 2-2v-5c-7 2-10-2-11-5c0 0 0-1-2-3c-1-1-5-3-1-3c3 0 5 4 5 4c3 4 7 3 9 2c0-2 2-4 2-4c-8-1-14-4-14-15q0-6 3-9s-2-4 0-9c0 0 5 0 9 4c3-2 13-2 16 0c4-4 9-4 9-4c2 7 0 9 0 9q3 3 3 9c0 11-7 14-14 15c1 1 2 3 2 6v8c0 1 0 2 2 2c3 0 22-9 22-30C64 14 50 0 32 0"
            />
          </svg>
          GitHub
        </button>
      </div>
    </div>
  );
}

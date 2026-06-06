import { AuthStatus } from "@/components/auth/auth-status";
import { ProfileCard } from "@/components/auth/profile-card";

import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6">
      <div className="relative mx-auto max-w-3xl">
        <div className="mt-5 flex items-center justify-between rounded-full border border-neutral-500/30 p-4">
          <Link
            href="https://github.com/akkaldhami/servercn"
            target="_blank"
            className="flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-2 text-sm font-medium text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.026 2a9.975 9.975 0 0 0-3.153 19.439c.5.09.679-.217.679-.481c0-.237-.008-.865-.011-1.7c-2.775.6-3.361-1.338-3.361-1.338a2.635 2.635 0 0 0-1.107-1.459c-.9-.619.069-.605.069-.605c.64.088 1.205.467 1.527 1.028a2.124 2.124 0 0 0 2.9.829c.046-.506.272-.979.635-1.334c-2.214-.251-4.542-1.107-4.542-4.93a3.865 3.865 0 0 1 1.026-2.671a3.588 3.588 0 0 1 .1-2.64s.837-.269 2.742 1.021a9.439 9.439 0 0 1 4.992 0c1.906-1.291 2.742-1.021 2.742-1.021c.37.835.405 1.78.1 2.64a3.84 3.84 0 0 1 1.024 2.675c0 3.833-2.33 4.675-4.552 4.922c.48.49.725 1.162.675 1.846c0 1.334-.012 2.41-.012 2.737c0 .267.178.577.687.479A9.975 9.975 0 0 0 12.026 2Z"
              />
            </svg>
            Star on GitHub
          </Link>
          <div className="flex items-center justify-center gap-4">
            <AuthStatus />
          </div>
        </div>

        <ProfileCard />
      </div>
    </main>
  );
}

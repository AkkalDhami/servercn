import { APP_NAME } from "@/lib/constants";
import { LucideTerminal } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="relative flex items-center gap-1 text-lg font-medium sm:text-xl">
      <span>{APP_NAME}</span>
      <LucideTerminal className="mt-1 size-5" />
    </Link>
  );
}

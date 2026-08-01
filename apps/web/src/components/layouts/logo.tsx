import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LucideTerminal } from "lucide-react";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative flex items-center gap-1 text-lg font-medium sm:text-xl",
        className
      )}>
      <span>{APP_NAME}</span>
      <LucideTerminal className="mt-1 size-5" />
    </Link>
  );
}

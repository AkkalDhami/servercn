import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="relative text-lg font-medium sm:text-xl">
      <span>ServerCN</span>
      <span className="bg-foreground text-accent absolute -top-1 -right-10 rounded-md px-1 py-0 text-sm">
        beta
      </span>
    </Link>
  );
}

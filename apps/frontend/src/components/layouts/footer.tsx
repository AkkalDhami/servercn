import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-muted-foreground border-t px-6 py-6 text-sm">
      <div className="container flex items-center justify-between">
        <span>© {new Date().getFullYear()} ServerCN</span>
        <div className="flex gap-4">
          <Link href="/docs">Docs</Link>
          <Link href="https://github.com/akkaldhami/servercn">GitHub</Link>
        </div>
      </div>
    </footer>
  );
}

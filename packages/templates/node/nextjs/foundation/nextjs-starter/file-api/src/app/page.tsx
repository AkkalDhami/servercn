import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-black px-6">
      <div className="mx-auto flex flex-col h-screen max-w-2xl items-center justify-center border-x border-neutral-700 text-center">
        <div className="mb-6 flex justify-center">
          <span className="text-muted-foreground rounded-full border border-neutral-500/30 px-4 py-1 text-sm">
            Powered by Servercn
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js Starter
        </h1>

        <p className="text-muted-foreground mt-6 text-lg">
          A Next.js foundation with a structured backend architecture — built
          for scalability with Servercn.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="https://github.com/akkaldhami/servercn"
            target="_blank"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-300">
            <Image src="/github.svg" alt="GitHub" width={20} height={20} /> Star
            on GitHub
          </Link>
          <Link
            href="https://servercn.vercel.app"
            target="_blank"
            className="rounded-full border border-neutral-400 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

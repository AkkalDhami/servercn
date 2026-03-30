import { OnThisPage } from "@/components/docs/on-this-page";
import DocsSidebar from "@/components/layouts/docs-sidebar";
import { MobileNav } from "@/components/layouts/mobile-nav";

export default function DocsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-edge dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)] relative mx-auto flex max-w-360 flex-col justify-between gap-1 divide-x border-x px-2 py-1 md:flex-row">
      <div className="fixed right-0 bottom-4 left-0 z-20 flex h-10 items-center px-4 lg:hidden">
        <MobileNav />
      </div>
      <aside className="hidden w-78 border-r py-0 pt-16 text-sm lg:block">
        <DocsSidebar />
      </aside>
      <main className="w-full flex-1 overflow-x-hidden px-2 pt-12 pb-8 md:pt-14">
        {children}
      </main>
      <aside className="docs-content no-scrollbar sticky top-20 hidden max-h-[calc(100vh-2rem)] space-y-4 overflow-y-auto xl:block">
        <OnThisPage />
      </aside>
    </div>
  );
}

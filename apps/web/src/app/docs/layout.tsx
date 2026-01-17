import DocsSidebar from "@/components/layouts/docs-sidebar";
import { MobileNav } from "@/components/layouts/mobile-nav";

export default function DocsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-between gap-8 px-2 py-1 md:flex-row">
      <div className="fixed right-0 bottom-4 left-0 z-20 flex h-10 items-center px-4 lg:hidden">
        <MobileNav />
      </div>
      <aside className="mt-14 ml-6 hidden w-78 border-r py-0 text-sm md:ml-6 lg:mb-10 lg:block">
        <DocsSidebar />
      </aside>
      <main className="w-full flex-1 pt-12 pb-16 md:pt-18">{children}</main>
    </div>
  );
}

import DocsSidebar from "@/components/layouts/docs-sidebar";
import Navbar from "@/components/layouts/navbar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-8 px-2 py-1">
      <Navbar />
      <aside className="lg:mg-10 mt-14 ml-6 hidden w-76 border-r py-0 text-sm md:ml-6 md:block">
        <DocsSidebar />
      </aside>
      <main className="w-full flex-1 pt-18 pb-16">{children}</main>
    </div>
  );
}

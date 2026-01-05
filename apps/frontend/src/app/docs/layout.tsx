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
      <aside className="mt-14 hidden md:block w-76 border-r md:ml-6 lg:mg-10 ml-6 py-0 text-sm">
        <DocsSidebar />
      </aside>
      <main className="w-full flex-1 pt-18 pb-16">{children}</main>
    </div>
  );
}

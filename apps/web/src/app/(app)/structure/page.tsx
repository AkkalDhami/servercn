import { FrameworkType, ItemType } from "@/@types/registry";
import ArchitectureTabs from "@/components/docs/architecture-tabs";
import CodeTheme from "@/components/docs/code-theme";
import ComponentFileViewer from "@/components/file-viewer";
import { Container } from "@/components/ui/container";

export default async function page(props: PageProps<"/components">) {
  const searchParams = await props.searchParams;
  return (
    <Container className="border-edge border-x px-0 pt-18">
      <div className="mt-2 w-full px-4">
        <h2 className="text-2xl font-medium tracking-tight">
          File &amp; Folder Structure
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ArchitectureTabs
            current={(searchParams?.arch as string) || "mvc"}
            framework={(searchParams?.framework as FrameworkType) || "express"}
          />
          <CodeTheme />
        </div>
        <ComponentFileViewer
          from="structure"
          slug={(searchParams?.slug as string) || ""}
          architecture={(searchParams?.arch as string) || ""}
          framework={(searchParams?.framework as string) || ""}
          type={(searchParams?.type as ItemType) || ""}
          database={(searchParams?.database as string) || undefined}
          orm={(searchParams?.orm as string) || undefined}
        />
      </div>
    </Container>
  );
}

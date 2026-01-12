"use client";

import { useSearchParams } from "next/navigation";
import ArchitectureTabs from "./architecture-tabs";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";
import type { FileNode } from "@/components/file-viewer/file-tree";

export function ArchitectureSection({
  mvcStructure,
  featureStructure,
  restricted
}: {
  mvcStructure: FileNode[];
  featureStructure: FileNode[];
  restricted: boolean;
}) {
  const searchParams = useSearchParams();
  const arch = searchParams.get("arch") ?? "mvc";

  console.log({ searchParams, arch, restricted });

  if (restricted) return null;

  const structure = arch === "feature" ? featureStructure : mvcStructure;

  return (
    <>
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">File &amp; Folder Structure</h2>
      <ArchitectureTabs current={arch} />
      <BackendStructureViewer structure={structure} />
    </>
  );
}

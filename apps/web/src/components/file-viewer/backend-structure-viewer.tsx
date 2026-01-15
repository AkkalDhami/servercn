"use client";

import * as React from "react";
import type { FileNode } from "./file-tree";
import { Separator } from "../ui/separator";
import FileTree from "./file-tree";
import FileViewer from "./file-viewer";
import { cn } from "@/lib/utils";

export default function BackendStructureViewer({
  structure,
  className,
  sidebar = "left"
}: {
  structure: FileNode[];
  className?: string;
  sidebar?: "right" | "left";
}) {
  const [activeFile, setActiveFile] = React.useState<FileNode & { type: "file" }>();

  if (sidebar === "right") {
    return (
      <div className={cn("bg-editor flex h-130 w-full max-w-[800px] overflow-auto", className)}>
        <div className="w-full max-w-[calc(100%-17rem)] overflow-auto p-4">
          <FileViewer content={activeFile?.content} />
        </div>
        <Separator orientation="vertical" className="bg-neutral-500/20" />
        <div className="code-wrapper w-72 overflow-auto p-4">
          <FileTree data={structure} activeFile={activeFile?.name} onSelect={setActiveFile} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-editor flex h-130 w-full max-w-[800px] overflow-auto rounded-xl border", className)}>
      <div className="code-wrapper w-72 overflow-auto p-4">
        <FileTree data={structure} activeFile={activeFile?.name} onSelect={setActiveFile} />
      </div>

      <Separator orientation="vertical" className="bg-neutral-500/20" />

      <div className="w-full max-w-[calc(100%-17rem)] overflow-auto">
        <FileViewer content={activeFile?.content} />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import type { FileNode } from "./file-tree";
import { Separator } from "../ui/separator";
import FileTree from "./file-tree";
import FileViewer from "./file-viewer";

export default function BackendStructureViewer({
  structure,
}: {
  structure: FileNode[];
}) {
  const [activeFile, setActiveFile] = React.useState<
    FileNode & { type: "file" }
  >();

  return (
    <div className="flex h-130 w-full max-w-4xl overflow-auto rounded-xl bg-[#0b0e14]">
      <div className="code-wrapper w-76 overflow-auto p-4">
        <FileTree
          data={structure}
          activeFile={activeFile?.name}
          onSelect={setActiveFile}
        />
      </div>

      <Separator orientation="vertical" className="bg-neutral-500/20" />

      <div className="w-full max-w-137 overflow-auto p-4">
        <FileViewer content={activeFile?.content} />
      </div>
    </div>
  );
}

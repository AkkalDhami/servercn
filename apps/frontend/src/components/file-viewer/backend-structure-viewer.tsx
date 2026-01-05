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
    <div className="flex max-w-4xl w-full overflow-auto h-130 bg-[#0b0e14] rounded-xl">
      <div className="w-80 p-4 code-wrapper overflow-auto">
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

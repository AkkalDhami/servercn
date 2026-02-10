"use client";

import * as React from "react";
import type { FileNode } from "./file-tree";
import { Separator } from "@/components/ui/separator";

import FileTree from "./file-tree";
import FileViewer from "./file-viewer";
import { cn } from "@/lib/utils";
import { useCodeThemeBg } from "@/store/use-code-theme";

export default function BackendStructureViewer({
  structure,
  className,
  sidebar = "left"
}: {
  structure: FileNode[];
  className?: string;
  sidebar?: "right" | "left";
}) {
  const { bg } = useCodeThemeBg();

  const [activeFile, setActiveFile] = React.useState<
    FileNode & { type: "file" }
  >();

  if (sidebar === "right") {
    return (
      <div
        className={cn(
          "thin-scrollbar flex h-130 w-full max-w-75 overflow-auto md:max-w-200",
          className
        )}>
        <div className="thin-scrollbar w-full max-w-[calc(100%-17rem)] overflow-auto p-4">
          <FileViewer content={activeFile?.content} />
        </div>
        <Separator orientation="vertical" className="bg-neutral-500/20" />
        <div className="code-wrapper thin-scrollbar w-72 overflow-auto p-4">
          <FileTree
            data={structure}
            activeFile={activeFile?.name}
            onSelect={setActiveFile}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-130 w-full max-w-[800px] overflow-auto rounded-xl",
        className
      )}
      style={{
        backgroundColor: bg,
        border: `1px solid ${bg}`
      }}>
      <div className="code-wrapper thin-scrollbar w-72 overflow-auto p-4">
        <FileTree
          data={structure}
          activeFile={activeFile?.name}
          onSelect={setActiveFile}
        />
      </div>

      <Separator orientation="vertical" className="bg-neutral-500/20" />

      <div className="thin-scrollbar w-full max-w-[calc(100%-17rem)] overflow-auto">
        <FileViewer content={activeFile?.content} />
      </div>
    </div>
  );
}

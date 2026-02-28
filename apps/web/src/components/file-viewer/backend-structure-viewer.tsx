"use client";

import * as React from "react";
import type { FileNode } from "./file-tree";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import FileTree from "./file-tree";
import FileViewer from "./file-viewer";
import { useCodeThemeBg } from "@/store/use-code-theme";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-50 max-w-md rounded-lg border md:min-w-112.5">
        <ResizablePanel defaultSize="25%">
          <FileViewer content={activeFile?.content} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="75%">
          <FileTree
            data={structure}
            activeFile={activeFile?.name}
            onSelect={setActiveFile}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="thin-scrollbar min-h-130 max-w-md rounded-lg border md:min-w-200"
      style={{
        backgroundColor: bg,
        border: `1px solid ${bg}`
      }}>
      <ResizablePanel defaultSize="35%" className="thin-scrollbar">
        <ScrollArea className="h-130 p-3">
          <FileTree
            data={structure}
            activeFile={activeFile?.name}
            onSelect={setActiveFile}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="65%">
        <ScrollArea aria-orientation="horizontal" className="h-130 w-auto">
          <FileViewer content={activeFile?.content} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

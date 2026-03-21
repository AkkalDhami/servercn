"use client";

import * as React from "react";
import FileTree, { type FileNode } from "@/components/file-viewer/file-tree";
import { getRegistryFileTree } from "@/lib/files";
import { useCodeTheme, useCodeThemeBg } from "@/store/use-code-theme";
import { highlightCode } from "@/app/actions/highlight";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CopyButton from "../docs/copy-button";
import { cn } from "@/lib/utils";
import { getIconForLanguageExtension } from "../docs/icons/language-icons";
import { ItemType } from "@/@types/registry";
import { FaMaximize } from "react-icons/fa6";
import Link from "next/link";
import { Maximize2Icon } from "lucide-react";
import { Route } from "next";
type Props = {
  slug: string;
  runtime?: string;
  framework?: string;
  architecture?: string;
  type: ItemType;
  from: "structure" | "docs";
};

export default function ComponentFileViewer({
  slug,
  runtime = "node",
  framework = "express",
  architecture = "mvc",
  from = "docs",
  type = "component"
}: Props) {
  const [tree, setTree] = React.useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = React.useState<string>();
  const [selectedFile, setSelectedFile] = React.useState<
    (FileNode & { type: "file" }) | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const { theme } = useCodeTheme();
  const { bg } = useCodeThemeBg();
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        setError(null);

        const fileTree = await getRegistryFileTree({
          slug,
          runtime,
          framework,
          architecture,
          type
        });
        setTree(fileTree.tree);
        // auto-select first file
        const firstFile = findFirstFile(fileTree.tree);
        if (firstFile) {
          setSelectedFile(firstFile);
          setActiveFile(firstFile.name);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [slug, runtime, framework, architecture]);

  React.useEffect(() => {
    if (!selectedFile?.content) {
      setHtml("");
      return;
    }

    const highlight = async () => {
      const result = await highlightCode(
        selectedFile?.content,
        selectedFile.lang || "ts",
        theme
      );
      setHtml(result);
    };

    highlight();
  }, [selectedFile?.content, theme]);

  function handleSelect(file: FileNode & { type: "file" }) {
    setSelectedFile(file);
    setActiveFile(file.name);
  }

  async function handleCopy() {
    if (!selectedFile?.content) return;

    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy file content:", error);
    }
  }

  if (loading) return <div className="p-4">Loading files...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-12">
      <ResizablePanelGroup
        orientation="horizontal"
        className={cn(
          "thin-scrollbar relative rounded-lg",
          from === "structure"
            ? "min-h-160 max-w-full md:min-w-full"
            : "min-h-130 max-w-md md:min-w-200"
        )}
        style={{
          backgroundColor: bg,
          border: `1px solid ${bg}`
        }}>
        <Link
          href={
            `/structure?type=${type}&slug=${slug}&arch=${architecture}&framework=${framework}` as Route
          }
          target="_blank"
          style={{
            backgroundColor: bg
          }}
          className="hover:bg-muted hover:text-primary text-muted-foreground absolute right-3 bottom-3 z-20 flex items-center justify-center rounded-md p-1.5 transition-all">
          <Maximize2Icon className="h-5 w-5" />
        </Link>
        <ResizablePanel defaultSize="35%" className="thin-scrollbar">
          <ScrollArea
            className={cn(
              "p-3",
              from === "structure" ? "h-160" : "h-150"
            )}>
            <FileTree
              data={tree}
              activeFile={activeFile}
              onSelect={handleSelect}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="65%">
          <div className="relative flex items-center justify-between border-b">
            <div className="text-muted-foreground flex items-center gap-1 px-2 py-2 text-sm">
              {getIconForLanguageExtension(
                selectedFile?.lang || "ts",
                selectedFile?.name
              )}{" "}
              {selectedFile?.name || "No file selected"}
            </div>
            <CopyButton
              bg={bg}
              handleCopy={handleCopy}
              copied={copied}
              className={cn(
                "absolute right-2 z-20 flex items-center justify-center transition-all",
                selectedFile?.content ? "cursor-pointer" : "cursor-not-allowed"
              )}
            />
          </div>
          <ScrollArea
            className={cn(
              "h-140 w-auto",
              from === "structure" ? "h-154" : "h-140"
            )}>
            <div
              className={cn(
                "h-full max-h-140 w-full",
                from === "structure" ? "max-h-154" : "max-h-140"
              )}
              style={{ backgroundColor: bg }}>
              <div
                className="relative [&_pre]:h-full [&_pre]:p-3.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function findFirstFile(
  nodes: FileNode[]
): (FileNode & { type: "file" }) | null {
  for (const node of nodes) {
    if (node.type === "file") return node;
    if (node.type === "folder") {
      const found = findFirstFile(node.children);
      if (found) return found;
    }
  }
  return null;
}

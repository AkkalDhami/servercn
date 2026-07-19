"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIconForLanguageExtension } from "@/components/docs/icons/language-icons";
import { FaFolder, FaFolderOpen } from "react-icons/fa6";

export type FileNode =
  | {
      path?: string;
      type: "folder";
      name: string;
      children: FileNode[];
    }
  | {
      path?: string;
      type: "file";
      name: string;
      content: string;
      lang?: string;
    };

type Props = {
  data: FileNode[];
  activeFile?: string;
  onSelect(file: FileNode & { type: "file" }): void;
};

export default function FileTree({ data, activeFile, onSelect }: Props) {
  return (
    <div className="text-sm [font-variant-ligatures:none]">
      {data?.map(node => (
        <TreeNode
          key={node.name}
          node={node}
          activeFile={activeFile}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  activeFile,
  onSelect
}: {
  node: FileNode;
  activeFile?: string;
  onSelect(file: FileNode & { type: "file" }): void;
}) {
  const [open, setOpen] = React.useState(true);

  if (node.type === "folder") {
    return (
      <div className="relative pl-1">
        <button
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-accent-foreground flex w-full cursor-pointer items-center gap-1 py-1">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {open ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
          <span>{node.name}</span>
        </button>
        {/* vertical line */}
        {open && (
          <div className="absolute top-5 my-auto left-[10.5px] h-[calc(100%-16px)] w-px bg-neutral-500/30" />
        )}

        {open && (
          <div className="space-y-1 pl-3">
            {node?.children?.map(child => (
              <TreeNode
                key={child.name}
                node={child}
                activeFile={activeFile}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node)}
      className={cn(
        "text-muted-foreground hover:bg-muted hover:text-accent-foreground ring-edge my-1 ml-0.5 flex w-auto cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left hover:ring-1",
        activeFile === node.path &&
          "bg-muted ring-edge text-accent-foreground ring-1"
      )}>
      {getIconForLanguageExtension(node.lang || "ts", node.name)}
      {node.name}
    </button>
  );
}

"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpenIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getIconForLanguageExtension } from "../docs/icons/language-icons";
import { FaFolder, FaFolderOpen } from "react-icons/fa6";

export type FileNode =
  | {
      type: "folder";
      name: string;
      children: FileNode[];
    }
  | {
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
    <div className="text-sm">
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
      <div className="pl-1">
        <button
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-accent-foreground flex w-full cursor-pointer items-center gap-1 py-1">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {open ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
          <span>{node.name}</span>
        </button>

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
        "text-muted-foreground hover:bg-muted hover:text-accent-foreground my-1 ml-0.5 flex w-auto cursor-pointer items-center gap-2 rounded-md px-2 py-1 border border-transparent hover:border-edge text-left",
        activeFile === node.name &&
          "bg-muted text-accent-foreground border-edge"
      )}>
      {getIconForLanguageExtension(node.lang || "ts", node.name)}
      {node.name}
    </button>
  );
}

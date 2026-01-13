"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, File, Folder, FolderOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
      language?: string;
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
        <TreeNode key={node.name} node={node} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </div>
  );
}

function TreeNode({ node, activeFile, onSelect }: { node: FileNode; activeFile?: string; onSelect(file: FileNode & { type: "file" }): void }) {
  const [open, setOpen] = React.useState(true);

  if (node.type === "folder") {
    return (
      <div className="pl-2">
        <button onClick={() => setOpen(!open)} className="flex w-full cursor-pointer items-center gap-1 py-1 text-neutral-300 hover:text-white">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {open ? <FolderOpenIcon size={14} /> : <Folder size={14} />}
          <span>{node.name}</span>
        </button>

        {open && (
          <div className="pl-4">
            {node?.children?.map(child => (
              <TreeNode key={child.name} node={child} activeFile={activeFile} onSelect={onSelect} />
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
        "ml-1 flex w-auto cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left text-neutral-300 hover:bg-neutral-800 hover:text-white",
        activeFile === node.name && "bg-neutral-800 font-medium text-white"
      )}>
      <File size={14} />
      {node.name}
    </button>
  );
}

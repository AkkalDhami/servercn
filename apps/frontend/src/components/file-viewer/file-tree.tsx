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
    <div className="text-sm ">
      {data?.map((node) => (
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
  onSelect,
}: {
  node: FileNode;
  activeFile?: string;
  onSelect(file: FileNode & { type: "file" }): void;
}) {
  const [open, setOpen] = React.useState(true);

  if (node.type === "folder") {
    return (
      <div className="pl-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center w-full cursor-pointer gap-1 py-1 text-neutral-300 hover:text-white">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {open ? <FolderOpenIcon size={14} /> :  <Folder size={14} />}
          <span>{node.name}</span>
        </button>

        {open && (
          <div className="pl-4">
            {node?.children?.map((child) => (
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
        "flex items-center text-neutral-300 hover:text-white cursor-pointer gap-2 py-1 ml-1 w-auto px-2 text-left hover:bg-[#202836] rounded-md",
        activeFile === node.name && "bg-[#202836] font-medium text-white"
      )}>
      <File size={14} />
      {node.name}
    </button>
  );
}

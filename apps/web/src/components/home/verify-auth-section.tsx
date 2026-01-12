"use client";
import mvcData from "../../data/verify-auth-mvc.json";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";

import { FileNode } from "../file-viewer/file-tree";
export default function VerifyAuthSection() {
  return (
    <section id="verify-auth-section" className="mx-auto w-full max-w-368 overflow-x-auto py-20">
      <BackendStructureViewer sidebar="right" structure={mvcData as FileNode[]} className="mx-auto h-140 w-full max-w-6xl" />
    </section>
  );
}

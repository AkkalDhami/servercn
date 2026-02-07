"use client";
import mvcData from "../../data/google-oauth.json";

import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";

import { FileNode } from "../file-viewer/file-tree";
import InstallComponentCommands from "../command/install-component-command";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
export default function GoogleOAuthSection() {
  return (
    <section
      id="google-oauth-section"
      className="mx-auto hidden w-full max-w-368 overflow-x-auto py-20 md:block">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">Google OAuth Component</Heading>
        <SubHeading className="text-muted-foreground mt-4">
          Everything you need to add Google OAuth to your backend, without the
          boilerplate.
        </SubHeading>
      </div>

      <div className="grid gap-18 md:grid-cols-1 lg:grid-cols-5">
        <InstallComponentCommands className="col-span-2" />

        <BackendStructureViewer
          sidebar="left"
          structure={mvcData as FileNode[]}
          className="col-span-3 h-140"
        />
      </div>
    </section>
  );
}

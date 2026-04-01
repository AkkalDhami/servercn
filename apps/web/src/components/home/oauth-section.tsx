"use client";
import InstallComponentCommands from "@/components/command/install-component-command";
import { Heading } from "@/components/ui/heading";
import { SubHeading } from "@/components/ui/sub-heading";
import { Section } from "@/components/ui/section";
import ComponentFileViewer from "../file-viewer";
export default function OAuthSection() {
  return (
    <Section id="google-oauth-section" className="hidden md:block">
      <div className="mb-12 text-center">
        <Heading className="text-3xl font-bold">OAuth Component</Heading>
        <SubHeading className="text-muted-foreground mt-4">
          Everything you need to add OAuth to your backend, without the
          boilerplate.
        </SubHeading>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-5">
        <InstallComponentCommands className="col-span-2" />

        <div className="col-span-3">
          <ComponentFileViewer
            from="structure"
            slug={"oauth"}
            architecture={"mvc"}
            framework={"express"}
            type={"component"}
            variant="google"
          />
        </div>
      </div>
    </Section>
  );
}

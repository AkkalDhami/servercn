import JSGuideModal from "@/components/home/js-guide-modal";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ExternalLinkIcon } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function JSGuideCTA() {
  return (
    <Section id="js-guide-cta" className="">
      <div className="bg-primary/5 relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 rounded-xl py-10">
        <div className="text-center">
          <h2 className="text-primary text-center text-2xl font-semibold text-balance md:text-4xl">
            Using JavaScript Instead of TypeScript?
          </h2>
          <p className="text-muted-foreground mt-4 text-base font-medium">
            <span className="capitalize">{APP_NAME}</span> components are
            written in TypeScript, but JavaScript developers can still use them.
            <br />
            Follow our guide to build the components and use the compiled
            JavaScript files in your Node.js project.
          </p>
        </div>

        <JSGuideModal>
          <Button size="lg" className="mx-auto flex items-center gap-2">
            View JavaScript Guide
            <ExternalLinkIcon className="size-4" />
          </Button>
        </JSGuideModal>
      </div>
    </Section>
  );
}

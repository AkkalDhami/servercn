import JSGuideModal from "@/components/home/js-guide-modal";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { ExternalLinkIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import DemoVideo from "./demo";

export default function JSGuideCTA() {
  return (
    <Section
      id="js-guide-cta"
      className="flex flex-col items-center justify-between gap-8 md:flex-row-reverse">
      <div className="relative mx-auto flex w-full flex-col justify-between gap-y-4 rounded-xl py-4">
        <h2 className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
          Using JavaScript Instead of TypeScript?
        </h2>
        <p className="text-muted-foreground mt-4 text-base sm:text-lg font-medium">
          <span className="capitalize">{APP_NAME}</span> components are written
          in TypeScript, but JavaScript developers can still use them.
          <br />
          Follow our guide to build the components and use the compiled
          JavaScript files in your Node.js project.
        </p>

        <JSGuideModal>
          <Button size="lg" className="flex gap-2 w-60">
            View JavaScript Guide
            <ExternalLinkIcon className="size-4" />
          </Button>
        </JSGuideModal>
      </div>

      <div className="">
        <DemoVideo />
      </div>
    </Section>
  );
}

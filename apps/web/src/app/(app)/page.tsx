import WhyServercn from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";

import CallToAction from "@/components/home/cta-section";
import OAuthSection from "@/components/home/oauth-section";
import JSGuideCTA from "@/components/home/js-guide-cta";
import Stats from "@/components/home/stats";
import SupportedFrameworks from "@/components/home/supported-frameworks";
import { cn } from "@/lib/utils";
import NextjsStarterSection from "@/components/home/nextjs-starter";
import HybridAuthSection from "@/components/home/hybrid-auth";
import ContributorCta from "@/components/home/contributor-cta";

export default function Home() {
  return (
    <main
      className={cn(
        "border-edge relative mx-auto max-w-360 border-x px-4",
        "dark:bg-[radial-gradient(35%_128px_at_0%_0%,--theme(--color-foreground/.08),transparent),radial-gradient(35%_128px_at_100%_0%,--theme(--color-foreground/.08),transparent)]"
      )}>
      <HeroSection />
      <Stats />
      <JSGuideCTA />
      <NextjsStarterSection />

      <SupportedFrameworks />
      <OAuthSection />
      <WhyServercn />
      <ContributorCta />
      <HybridAuthSection />
      <CallToAction />
    </main>
  );
}

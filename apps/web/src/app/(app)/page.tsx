import WhyServerCN from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";

import CallToAction from "@/components/home/cta-section";
import OAuthSection from "@/components/home/oauth-section";
import JSGuideCTA from "@/components/home/js-guide-cta";
import Stats from "@/components/home/stats";

export default function Home() {
  return (
    <main className="border-edge relative mx-auto max-w-360 border-x px-4">
      <HeroSection />
      <Stats />
      <JSGuideCTA />
      <OAuthSection />
      <WhyServerCN />
      <CallToAction />
    </main>
  );
}

import WhyServerCN from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";

import CallToAction from "@/components/home/cta-section";
import OAuthSection from "@/components/home/oauth-section";
import JSGuideCTA from "@/components/home/js-guide-cta";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <JSGuideCTA />
      <OAuthSection />
      <WhyServerCN />
      <CallToAction />
    </main>
  );
}

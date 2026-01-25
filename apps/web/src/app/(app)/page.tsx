import WhyServerCN from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";
import GoogleOAuthSection from "@/components/home/google-auth-section";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <GoogleOAuthSection />
      <WhyServerCN />
    </main>
  );
}

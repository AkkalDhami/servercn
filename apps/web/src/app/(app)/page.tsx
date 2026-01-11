import WhyServerCN from "@/components/home/feature-section";
import HeroSection from "@/components/home/hero-section";
import VerifyAuthSection from "@/components/home/verify-auth-section";
import Working from "@/components/home/working";

export default function Home() {
  return (
    <main className="">
      <HeroSection />
      {/* <VerifyAuthSection /> */}
      <WhyServerCN />
      <Working />
    </main>
  );
}

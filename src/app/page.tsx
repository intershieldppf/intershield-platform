import { AboutSection } from "@/components/AboutSection";
import { FeatureSection } from "@/components/FeatureSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/HeroSection";
import { InfoSection } from "@/components/InfoSection";
import { InteriorProtectionVideoSection } from "@/components/InteriorProtectionVideoSection";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { SupportSection } from "@/components/SupportSection";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <HeroSection />
        <InteriorProtectionVideoSection />

        <div className="mx-auto max-w-7xl space-y-20 px-6 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <InfoSection />
          <FeatureSection />
          <AboutSection />
          <MarketplaceSection />
          <SupportSection />
        </div>
      </main>
    </div>
  );
}

import Image from "next/image";

import { AboutSection } from "@/components/AboutSection";
import { FeatureSection } from "@/components/FeatureSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/HeroSection";
import { InfoSection } from "@/components/InfoSection";
import { InteriorProtectionVideoSection } from "@/components/InteriorProtectionVideoSection";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { SupportSection } from "@/components/SupportSection";
import { VehicleBar } from "@/components/search/VehicleBar";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        <section className="bg-white pb-0 pt-2 sm:pt-3">
          <div className="flex items-center justify-center">
            <Image
              src="/intershield-shield-v2.png"
              alt="InterShield Películas"
              width={460}
              height={240}
              priority
              className="h-auto w-[290px] object-contain sm:w-[330px] lg:w-[360px]"
            />
          </div>
        </section>

        <VehicleBar />
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

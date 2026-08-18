import Image from "next/image";

import { AboutSection } from "@/components/AboutSection";
import { FeatureSection } from "@/components/FeatureSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/HeroSection";
import { InfoSection } from "@/components/InfoSection";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { SupportSection } from "@/components/SupportSection";
import { VehicleBar } from "@/components/search/VehicleBar";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <Header />

      <main className="overflow-hidden">
        {/* LOGO INTERSHIELD */}
        <section className="bg-white pb-1 pt-5">
          <div className="flex items-center justify-center">
            <Image
              src="/intershield-shield-v2.png"
              alt="InterShield Películas"
              width={340}
              height={180}
              priority
              className="h-auto w-[230px] object-contain sm:w-[260px]"
            />
          </div>
        </section>

        {/* BUSCA DO VEÍCULO */}
        <VehicleBar />

        {/* HERO PRINCIPAL */}
        <HeroSection />

        {/* RESTANTE DA HOME */}
        <div className="mx-auto max-w-7xl space-y-20 px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
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
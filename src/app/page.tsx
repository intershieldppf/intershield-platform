import { AboutSection } from "@/components/AboutSection";
import { FeatureSection } from "@/components/FeatureSection";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/HeroSection";
import { InfoSection } from "@/components/InfoSection";
import { InteriorProtectionVideoSection } from "@/components/InteriorProtectionVideoSection";
import { MarketplaceSection } from "@/components/MarketplaceSection";
import { SupportSection } from "@/components/SupportSection";

export default function Home() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": "https://www.intershield.com.br/#organization",
    name: "InterShield Películas",
    url: "https://www.intershield.com.br/",
    logo: "https://www.intershield.com.br/intershield-shield-v2.png",
    image: "https://www.intershield.com.br/intershield-hero-bmw.webp",
    description:
      "Loja especializada em kits PPF automotivos e acabamentos pré-cortados para veículos.",
    telephone: "+55 31 99714-6624",
    email: "contato@intershield.com.br",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Igarapé",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55 31 99714-6624",
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://www.instagram.com/intershieldpeliculas/",
      "https://www.tiktok.com/@intershieldppf",
      "https://www.mercadolivre.com.br/pagina/intershieldppf",
      "https://shopee.com.br/intershieldppf",
    ],
  };

  return (
    <div id="top" className="min-h-screen bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData).replace(/</g, "\\u003c"),
        }}
      />
      <Header />

      <main className="overflow-hidden">
        <HeroSection />
        <InteriorProtectionVideoSection />

        <div className="mx-auto max-w-7xl space-y-20 px-6 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <InfoSection />
          <MarketplaceSection />
          <FeatureSection />
          <AboutSection />
          <SupportSection />
        </div>
      </main>
    </div>
  );
}

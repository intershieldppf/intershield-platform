import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.intershield.com.br"),
  title: {
    default: "InterShield Películas | Kits PPF e Black Piano sob medida",
    template: "%s | InterShield Películas",
  },
  description:
    "Kits PPF automotivos e acabamentos Black Piano pré-cortados para multimídias, painéis, consoles, colunas e outras áreas do veículo.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "InterShield Películas",
    title: "InterShield Películas | Kits PPF e Black Piano sob medida",
    description:
      "Kits PPF automotivos e acabamentos Black Piano pré-cortados para cada veículo.",
    url: "/",
    images: [
      {
        url: "/intershield-hero-bmw.webp",
        width: 1600,
        height: 1000,
        alt: "Proteção automotiva InterShield",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterShield Películas",
    description: "Kits PPF e Black Piano pré-cortados para cada veículo.",
    images: ["/intershield-hero-bmw.webp"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: "/intershield-favicon-v3.svg?v=3",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/intershield-favicon-v3.svg?v=3",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <SiteFooter />
        <AnalyticsConsent
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
        />
      </body>
    </html>
  );
}

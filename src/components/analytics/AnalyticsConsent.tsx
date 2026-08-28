"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";

type Consent = "accepted" | "rejected" | null;
const CONSENT_KEY = "intershield-analytics-consent";

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getConsentSnapshot() {
  return window.localStorage.getItem(CONSENT_KEY);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function track(name: string, parameters: Record<string, string>) {
  window.gtag?.("event", name, parameters);
  window.fbq?.("trackCustom", name, parameters);
}

export function AnalyticsConsent({
  googleAnalyticsId,
  metaPixelId,
}: {
  googleAnalyticsId?: string;
  metaPixelId?: string;
}) {
  const [consent, setConsent] = useState<Consent>(null);
  const savedConsent = useSyncExternalStore(subscribeToStorage, getConsentSnapshot, () => null);
  const effectiveConsent =
    consent ?? (savedConsent === "accepted" || savedConsent === "rejected" ? savedConsent : null);

  useEffect(() => {
    if (effectiveConsent !== "accepted") return undefined;

    function handleClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest("a");
      const href = anchor?.getAttribute("href") ?? "";
      if (!href) return;

      if (href.includes("wa.me")) track("whatsapp_click", { href });
      else if (/mercadolivre|shopee|tiktok/.test(href)) track("marketplace_click", { href });
      else if (href.startsWith("/produto/")) track("product_click", { href });
      else if (href.startsWith("/catalogo")) track("catalog_click", { href });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [effectiveConsent]);

  if (!googleAnalyticsId && !metaPixelId) return null;

  function saveConsent(value: Exclude<Consent, null>) {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {effectiveConsent === "accepted" && googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="intershield-google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${googleAnalyticsId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {effectiveConsent === "accepted" && metaPixelId ? (
        <Script id="intershield-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {effectiveConsent === null ? (
        <aside
          aria-label="Preferências de privacidade"
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:flex sm:items-center sm:gap-6"
        >
          <p className="flex-1 text-sm leading-6 text-slate-600">
            Usamos métricas opcionais para melhorar o catálogo. Elas só são ativadas com sua autorização.{" "}
            <Link href="/privacidade" className="font-semibold text-blue-600 hover:text-blue-500">
              Saiba mais
            </Link>
          </p>
          <div className="mt-4 flex gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
            >
              Recusar
            </button>
            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Aceitar
            </button>
          </div>
        </aside>
      ) : null}
    </>
  );
}

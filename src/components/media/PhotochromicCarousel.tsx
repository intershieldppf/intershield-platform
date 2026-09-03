"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const slides = [
  {
    src: "/ppf-fotocromatico-carrossel-05.webp",
    alt: "Veículo prata com faróis personalizados por PPF fotocromático",
  },
  {
    src: "/ppf-fotocromatico-carrossel-01.webp",
    alt: "Comparação do PPF fotocromático sob maior e menor incidência de luz ultravioleta",
  },
  {
    src: "/ppf-fotocromatico-carrossel-02.webp",
    alt: "Explicação de que a luz do farol não ativa o efeito fotocromático",
  },
  {
    src: "/ppf-fotocromatico-carrossel-03.webp",
    alt: "Diferença entre película fumê de tonalidade fixa e PPF que responde à luz ultravioleta",
  },
  {
    src: "/ppf-fotocromatico-carrossel-04.webp",
    alt: "Proteção do farol contra pedriscos leves, riscos superficiais e desgaste cotidiano",
  },
] as const;

const SWIPE_DISTANCE = 45;

export function PhotochromicCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectedSlide = slides[selectedIndex];

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;

    const horizontalDistance = event.clientX - start.x;
    const verticalDistance = event.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= SWIPE_DISTANCE &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

    if (!isHorizontalSwipe) return;
    if (horizontalDistance < 0) showNext();
    else showPrevious();
  }

  return (
    <div className="relative mx-auto w-full max-w-[470px]">
      <div className="absolute -inset-4 rounded-[40px] border border-blue-400/15" />
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#020714] shadow-[0_35px_90px_-44px_rgba(37,99,235,0.75)]">
        <div
          className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden bg-slate-950"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStartRef.current = null;
          }}
          aria-live="polite"
        >
          <Image
            key={selectedSlide.src}
            src={selectedSlide.src}
            alt={selectedSlide.alt}
            fill
            priority={selectedIndex === 0}
            draggable={false}
            sizes="(max-width: 1024px) 90vw, 470px"
            className="object-cover"
          />

          <button
            type="button"
            onClick={showPrevious}
            aria-label="Ver arte anterior"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Ver próxima arte"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-16 items-center justify-between gap-4 border-t border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image
                src="/intershield-shield-v2.png"
                alt=""
                width={96}
                height={64}
                className="pointer-events-none absolute left-1/2 top-[-7px] h-auto w-[92px] max-w-none -translate-x-1/2 object-contain"
              />
            </span>
            <span className="leading-none">
              <span className="block text-[11px] font-bold tracking-[0.17em] text-white">
                INTERSHIELD
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.19em] text-blue-300">
                PELÍCULAS
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2" aria-label={`Arte ${selectedIndex + 1} de ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver arte ${index + 1}`}
                aria-pressed={selectedIndex === index}
                className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  selectedIndex === index ? "w-6 bg-blue-500" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

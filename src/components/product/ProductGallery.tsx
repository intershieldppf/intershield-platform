"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

type SwipeStart = {
  x: number;
  y: number;
};

const SWIPE_DISTANCE = 45;

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const ignoreNextClickRef = useRef(false);
  const selectedImage = images[selectedIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  const showPrevious = useCallback(() => {
    if (!hasMultipleImages) return;

    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  }, [hasMultipleImages, images.length]);

  const showNext = useCallback(() => {
    if (!hasMultipleImages) return;

    setSelectedIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  }, [hasMultipleImages, images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, showNext, showPrevious]);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(event: React.PointerEvent<HTMLElement>) {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!swipeStart || !hasMultipleImages) return;

    const horizontalDistance = event.clientX - swipeStart.x;
    const verticalDistance = event.clientY - swipeStart.y;
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= SWIPE_DISTANCE &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

    if (!isHorizontalSwipe) return;

    ignoreNextClickRef.current = true;

    if (horizontalDistance < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  function handleMainImageClick() {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }

    setIsLightboxOpen(true);
  }

  function handleMainImageKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsLightboxOpen(true);
    }
  }

  return (
    <div>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStartRef.current = null;
        }}
        className="group relative flex aspect-square touch-pan-y select-none items-center justify-center overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50"
      >
        {selectedImage ? (
          <button
            type="button"
            aria-label={`Ampliar imagem ${selectedIndex + 1} de ${name}`}
            onClick={handleMainImageClick}
            onKeyDown={handleMainImageKeyDown}
            className="absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
          >
            <Image
              src={selectedImage}
              alt={`${name} - imagem ${selectedIndex + 1}`}
              fill
              priority
              draggable={false}
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-contain p-4 sm:p-8"
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            Imagem do produto não disponível
          </div>
        )}

        {selectedImage ? (
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-2 text-xs font-semibold text-white opacity-100 backdrop-blur-sm transition sm:opacity-0 sm:group-hover:opacity-100">
            <Expand className="h-4 w-4" />
            Ampliar
          </span>
        ) : null}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              aria-label="Ver imagem anterior"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-900 shadow-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Ver próxima imagem"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-900 shadow-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          aria-label="Galeria de imagens do produto"
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver imagem ${index + 1} de ${name}`}
              aria-pressed={selectedIndex === index}
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 transition sm:h-20 sm:w-20 ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <Image
                src={image}
                alt=""
                width={80}
                height={80}
                draggable={false}
                sizes="80px"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}

      {isLightboxOpen && selectedImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${name}`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-slate-950/95 p-3 sm:p-8"
        >
          <button
            type="button"
            aria-label="Fechar imagem ampliada"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeStartRef.current = null;
            }}
            className="relative h-full w-full max-w-6xl select-none"
          >
            <Image
              src={selectedImage}
              alt={`${name} - imagem ${selectedIndex + 1} ampliada`}
              fill
              priority
              draggable={false}
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                aria-label="Ver imagem anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:bg-slate-100 sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                aria-label="Ver próxima imagem"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:bg-slate-100 sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <span className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

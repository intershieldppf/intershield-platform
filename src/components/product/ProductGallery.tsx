"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";

type ProductGalleryVideo = {
  src: string;
  poster: string;
  label: string;
  position?: number;
};

type ProductGalleryProps = {
  name: string;
  images: string[];
  video?: ProductGalleryVideo;
};

type GalleryItem =
  | { type: "image"; src: string }
  | ({ type: "video" } & ProductGalleryVideo);

type SwipeStart = {
  x: number;
  y: number;
};

const SWIPE_DISTANCE = 45;

export function ProductGallery({ name, images, video }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const ignoreNextClickRef = useRef(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mediaItems = useMemo<GalleryItem[]>(
    () => {
      const imageItems = images.map((src) => ({ type: "image" as const, src }));

      if (!video) return imageItems;

      const videoPosition = Math.min(
        Math.max(video.position ?? imageItems.length, 0),
        imageItems.length,
      );

      return [
        ...imageItems.slice(0, videoPosition),
        { type: "video" as const, ...video },
        ...imageItems.slice(videoPosition),
      ];
    },
    [images, video],
  );
  const imageIndexes = useMemo(
    () =>
      mediaItems.reduce<number[]>((indexes, item, index) => {
        if (item.type === "image") indexes.push(index);
        return indexes;
      }, []),
    [mediaItems],
  );
  const selectedItem = mediaItems[selectedIndex] ?? mediaItems[0];
  const selectedImage = selectedItem?.type === "image" ? selectedItem.src : null;
  const selectedVideo = selectedItem?.type === "video" ? selectedItem : null;
  const hasMultipleItems = mediaItems.length > 1;

  const showPrevious = useCallback(() => {
    if (!hasMultipleItems) return;

    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1,
    );
  }, [hasMultipleItems, mediaItems.length]);

  const showNext = useCallback(() => {
    if (!hasMultipleItems) return;

    setSelectedIndex((currentIndex) =>
      currentIndex === mediaItems.length - 1 ? 0 : currentIndex + 1,
    );
  }, [hasMultipleItems, mediaItems.length]);

  const showPreviousImage = useCallback(() => {
    if (imageIndexes.length < 2) return;

    setSelectedIndex((currentIndex) => {
      const currentPosition = imageIndexes.indexOf(currentIndex);
      const previousPosition = currentPosition <= 0 ? imageIndexes.length - 1 : currentPosition - 1;
      return imageIndexes[previousPosition];
    });
  }, [imageIndexes]);

  const showNextImage = useCallback(() => {
    if (imageIndexes.length < 2) return;

    setSelectedIndex((currentIndex) => {
      const currentPosition = imageIndexes.indexOf(currentIndex);
      const nextPosition =
        currentPosition === -1 || currentPosition === imageIndexes.length - 1
          ? 0
          : currentPosition + 1;
      return imageIndexes[nextPosition];
    });
  }, [imageIndexes]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
    };
  }, [isLightboxOpen, showNextImage, showPreviousImage]);

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLElement>,
    onPrevious = showPrevious,
    onNext = showNext,
  ) {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!swipeStart || !hasMultipleItems) return;

    const horizontalDistance = event.clientX - swipeStart.x;
    const verticalDistance = event.clientY - swipeStart.y;
    const isHorizontalSwipe =
      Math.abs(horizontalDistance) >= SWIPE_DISTANCE &&
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2;

    if (!isHorizontalSwipe) return;

    ignoreNextClickRef.current = true;

    if (horizontalDistance < 0) {
      onNext();
    } else {
      onPrevious();
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
        onPointerDown={selectedVideo ? undefined : handlePointerDown}
        onPointerUp={selectedVideo ? undefined : handlePointerUp}
        onPointerCancel={
          selectedVideo
            ? undefined
            : () => {
                swipeStartRef.current = null;
              }
        }
        className="group relative flex aspect-square touch-pan-y select-none items-center justify-center overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50"
      >
        {selectedImage ? (
          <button
            ref={openerRef}
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
        ) : selectedVideo ? (
          <video
            key={selectedVideo.src}
            controls
            playsInline
            preload="metadata"
            poster={selectedVideo.poster}
            aria-label={selectedVideo.label}
            className="h-full w-full bg-slate-950 object-contain"
          >
            <source src={selectedVideo.src} type="video/mp4" />
            Seu navegador não suporta a reprodução deste vídeo.
          </video>
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

        {hasMultipleItems ? (
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

            <span
              className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm ${
                selectedVideo ? "top-3" : "bottom-3"
              }`}
            >
              {selectedIndex + 1} / {mediaItems.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultipleItems ? (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          aria-label="Galeria de fotos e vídeo do produto"
        >
          {mediaItems.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={
                item.type === "image"
                  ? `Ver imagem ${index + 1} de ${name}`
                  : `Reproduzir vídeo de ${name}`
              }
              aria-pressed={selectedIndex === index}
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-1.5 transition sm:h-20 sm:w-20 ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt=""
                  width={80}
                  height={80}
                  draggable={false}
                  sizes="80px"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="relative h-full w-full overflow-hidden rounded-lg bg-slate-950">
                  <Image
                    src={item.poster}
                    alt=""
                    fill
                    draggable={false}
                    sizes="80px"
                    className="object-cover opacity-80"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow-sm">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </span>
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      ) : null}

      {isLightboxOpen && selectedImage ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada de ${name}`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-slate-950/95 p-3 sm:p-8"
        >
          <button
            ref={closeButtonRef}
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
            onPointerUp={(event) =>
              handlePointerUp(event, showPreviousImage, showNextImage)
            }
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

          {imageIndexes.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Ver imagem anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
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
                  showNextImage();
                }}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:bg-slate-100 sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <span className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                {imageIndexes.indexOf(selectedIndex) + 1} / {imageIndexes.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

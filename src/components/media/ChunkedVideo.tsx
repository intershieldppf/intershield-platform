"use client";

import { useEffect, useRef, useState } from "react";

type ChunkedVideoProps = {
  ariaLabel: string;
  chunks: readonly string[];
  className?: string;
  loop?: boolean;
  poster?: string;
};

export function ChunkedVideo({
  ariaLabel,
  chunks,
  className,
  loop = false,
  poster,
}: ChunkedVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [source, setSource] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const controller = new AbortController();
    let objectUrl: string | undefined;

    Promise.all(
      chunks.map(async (chunk) => {
        const response = await fetch(chunk, { signal: controller.signal });
        if (!response.ok) throw new Error(`Falha ao carregar ${chunk}`);
        return response.blob();
      }),
    )
      .then((parts) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(new Blob(parts, { type: "video/mp4" }));
        setSource(objectUrl);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [chunks, shouldLoad]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <video
        aria-label={ariaLabel}
        className={className}
        controls={Boolean(source)}
        loop={loop}
        playsInline
        poster={poster}
        preload={source ? "metadata" : "none"}
        src={source}
      >
        Seu navegador não oferece suporte à reprodução deste vídeo.
      </video>

      {!source && !failed ? (
        <span className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-white/70">
          Carregando vídeo…
        </span>
      ) : null}

      {failed ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center text-xs text-white">
          Não foi possível carregar o vídeo. Atualize a página e tente novamente.
        </span>
      ) : null}
    </div>
  );
}

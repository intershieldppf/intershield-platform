"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={`${name} - imagem ${selectedIndex + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-contain p-4 sm:p-8"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            Imagem do produto não disponível
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Galeria de imagens do produto">
          {images.slice(0, 8).map((image, index) => (
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
                sizes="80px"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

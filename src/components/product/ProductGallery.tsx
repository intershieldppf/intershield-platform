type ProductGalleryProps = {
  name: string;
  mainImageUrl?: string;
  galleryImageUrls?: string[];
};

export function ProductGallery({ name, mainImageUrl, galleryImageUrls = [] }: ProductGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-sm">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={`Imagem principal do ${name}`}
            className="h-[420px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[420px] items-center justify-center bg-slate-800 text-slate-300">
            Imagem do produto não disponível
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {galleryImageUrls.length > 0 ? (
          galleryImageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950 shadow-sm"
            >
              <img
                src={imageUrl}
                alt={`${name} miniatura ${index + 1}`}
                className="h-28 w-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 rounded-[1.5rem] border border-slate-200 bg-slate-950 p-10 text-center text-slate-300">
            Miniaturas não disponíveis
          </div>
        )}
      </div>
    </div>
  );
}

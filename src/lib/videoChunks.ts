function chunkPaths(name: string, count: number) {
  return Array.from(
    { length: count },
    (_, index) => `/video-chunks/${name}/part-${String(index).padStart(2, "0")}`,
  );
}

export const videoChunks = {
  blackPianoCut: chunkPaths("coluna-black-piano-corte", 4),
  interiorProtection: chunkPaths("protecao-interior-intershield", 6),
  plotterCut: chunkPaths("corte-ppf-plotter", 7),
  selfHealing: chunkPaths("ppf-auto-regeneracao-intershield", 5),
} as const;

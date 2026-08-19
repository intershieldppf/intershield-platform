import type { ReactNode } from "react";

export default function BlackPianoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="black-piano-page">
      <style>{`
        .black-piano-page main > section:first-child h1 span {
          color: #020617 !important;
        }

        .black-piano-page main > section:first-child > div > div:nth-child(2) {
          background-image: url('/black-piano-before-after.svg') !important;
          background-size: cover !important;
          background-position: center 45% !important;
          background-repeat: no-repeat !important;
          background-color: #ffffff !important;
        }

        .black-piano-page main > section:first-child > div > div:nth-child(2) > div {
          display: none !important;
        }

        .black-piano-page main > section:nth-child(2) > div > div > article > div > article:nth-child(1) > div:first-child {
          background-image: url('/black-piano-card-gloss.webp') !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          background-color: #f8fafc !important;
        }

        .black-piano-page main > section:nth-child(2) > div > div > article > div > article:nth-child(2) > div:first-child {
          background-image: url('/black-piano-card-matte.webp') !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          background-color: #18181b !important;
        }

        .black-piano-page main > section:nth-child(2) > div > div > article > div > article:nth-child(3) > div:first-child {
          background-image: url('/black-piano-card-carbon.webp') !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          background-color: #0f172a !important;
        }

        .black-piano-page main > section:nth-child(2) > div > div > article > div > article > div:first-child > div {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

export default function BlackPianoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="black-piano-page">
      <style>{`
        .black-piano-page main > section:first-child h1 span {
          color: #020617 !important;
        }

        .black-piano-page main > section:first-child > div > div:nth-child(2) {
          position: relative !important;
          background-image: url('/black-piano-antes-depois.png') !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          background-color: #ffffff !important;
        }

        .black-piano-page main > section:first-child > div > div:nth-child(2)::after {
          content: "";
          position: absolute;
          right: 18px;
          bottom: 18px;
          width: clamp(145px, 29%, 205px);
          aspect-ratio: 1 / 1;
          border: 5px solid rgba(255, 255, 255, 0.96);
          border-radius: 22px;
          background-image: url('/black-piano-vinil.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 18px 45px -18px rgba(15, 23, 42, 0.55);
          z-index: 2;
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

        @media (max-width: 640px) {
          .black-piano-page main > section:first-child > div > div:nth-child(2)::after {
            right: 12px;
            bottom: 12px;
            width: 34%;
            min-width: 118px;
            border-width: 4px;
            border-radius: 18px;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

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
      `}</style>
      {children}
    </div>
  );
}

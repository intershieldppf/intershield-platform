import type { ReactNode } from "react";

export default function BlackPianoLayout({ children }: { children: ReactNode }) {
  return <div className="black-piano-page">{children}</div>;
}

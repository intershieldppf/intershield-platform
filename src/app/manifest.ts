import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InterShield Películas",
    short_name: "InterShield",
    description: "Proteção e acabamento automotivo sob medida.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [{ src: "/intershield-favicon-v3.svg?v=3", sizes: "any", type: "image/svg+xml" }],
  };
}

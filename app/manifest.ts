import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arkz - Nikke: Goddess of Victory Team Database",
    short_name: "Arkz",
    description: "Optimize your Nikke squads with top-tier team compositions",
    start_url: "/",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#0a0a0a",
    background_color: "#0a0a0a",
    display: "standalone",
    orientation: "portrait",
    categories: ["games", "strategy", "database"],
  };
}
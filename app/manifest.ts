import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Martin Barber",
    short_name: "Martin Barber",
    description:
      "Pánsky strih, úprava brady a poctivé holičské remeslo v Prešove.",
    lang: "sk",
    start_url: "/",
    display: "standalone",
    background_color: "#0E0D0C",
    theme_color: "#0E0D0C",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

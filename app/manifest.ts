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
    background_color: "#F5E3BE",
    theme_color: "#F5E3BE",
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

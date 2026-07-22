import type { LucideIcon } from "lucide-react";
import {
  Scissors,
  Waves,
  Sparkles,
  UserRound,
  Wand2,
  Baby,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const siteConfig = {
  name: "Martin Barber",
  city: "Prešov",
  phone: "0948 177 144",
  phoneHref: "tel:+421948177144",
  address: "Weberova 11710/6, 080 01 Prešov",
  streetAddress: "Weberova 11710/6",
  postalCode: "080 01",
  bookingUrl: "#kontakt",
  instagramUrl: "",
  facebookUrl: "",
  openingHours: [] as string[],
  metaTitle: "Martin Barber | Barbershop Prešov",
  metaDescription:
    "Pánsky strih, úprava brady a poctivé holičské remeslo v autentickom barbershope v Prešove.",
} as const;

export const nav = [
  { label: "Služby", href: "#sluzby" },
  { label: "Atmosféra", href: "#atmosfera" },
  { label: "Rezervácia", href: "#rezervacia" },
] as const;

export const services: Service[] = [
  {
    icon: Scissors,
    title: "Pánsky strih",
    description:
      "Precízny strih prispôsobený tvaru tváre, typu vlasov a osobnému štýlu.",
  },
  {
    icon: Waves,
    title: "Skin fade",
    description:
      "Čisté prechody, ostré línie a detailne spracovaný výsledok.",
  },
  {
    icon: UserRound,
    title: "Úprava brady",
    description:
      "Tvarovanie, zastrihnutie a upravené kontúry pre prirodzený vzhľad.",
  },
  {
    icon: Sparkles,
    title: "Strih a brada",
    description:
      "Kompletná starostlivosť o účes aj bradu počas jednej návštevy.",
  },
  {
    icon: Wand2,
    title: "Styling",
    description:
      "Finálna úprava a odporúčanie vhodnej každodennej starostlivosti.",
  },
  {
    icon: Baby,
    title: "Detský strih",
    description:
      "Pokojný a profesionálny prístup aj k najmladším zákazníkom.",
  },
];

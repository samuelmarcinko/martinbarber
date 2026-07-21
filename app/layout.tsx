import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteUrl } from "./lib/siteUrl";
import { siteConfig } from "./lib/siteConfig";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
    images: [
      {
        url: "/images/martinbarber-start.png",
        width: 1680,
        height: 936,
        alt: "Interiér barbershopu Martin Barber v Prešove",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
    images: ["/images/martinbarber-start.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk" className={`${bebas.variable} ${manrope.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

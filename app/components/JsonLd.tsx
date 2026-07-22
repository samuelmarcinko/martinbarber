import { siteUrl } from "../lib/siteUrl";
import { siteConfig } from "../lib/siteConfig";

/**
 * LocalBusiness / HairSalon structured data.
 * Only known, verifiable information is included — no ratings, reviews,
 * prices, phone number, coordinates, opening hours or exact street address
 * are invented.
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: siteConfig.name,
    description: siteConfig.metaDescription,
    url: siteUrl,
    image: `${siteUrl}/images/martinbarber-start.png`,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.city,
      addressCountry: "SK",
    },
    areaServed: siteConfig.city,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

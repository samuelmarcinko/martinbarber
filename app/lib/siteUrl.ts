/**
 * Resolve the public site URL used for metadata, canonical URLs, sitemap,
 * robots and JSON-LD. Priority:
 *   1. NEXT_PUBLIC_SITE_URL           (explicit override)
 *   2. VERCEL_PROJECT_PRODUCTION_URL  (stable production domain on Vercel)
 *   3. VERCEL_URL                     (per-deployment URL on Vercel)
 *   4. http://localhost:3000          (local development)
 *
 * Vercel system variables do not include a protocol, so we prepend https://.
 */
function withProtocol(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit && explicit.trim().length > 0) return withProtocol(explicit);

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod && prod.trim().length > 0) return withProtocol(prod);

  const vercel = process.env.VERCEL_URL;
  if (vercel && vercel.trim().length > 0) return withProtocol(vercel);

  return "http://localhost:3000";
}

export const siteUrl = getSiteUrl();

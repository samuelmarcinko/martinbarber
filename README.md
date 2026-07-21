# Martin Barber — Barbershop Prešov

A production, scroll-driven landing page for **Martin Barber**, a premium men's
barbershop in Prešov. As the visitor scrolls, an HTML canvas scrubs through a
sequence of JPEG frames extracted from a cinematic dolly-forward hero video —
scrolling **down** moves the camera deeper into the shop, scrolling **up** plays
the exact same movement in reverse.

## Technology stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Framer Motion** for entrance / in-view animation
- **lucide-react** icons
- **@vercel/analytics** and **@vercel/speed-insights**
- Canvas + `requestAnimationFrame` frame scrubbing (no WebGL, no Three.js, no
  video element for the active scroll animation)
- Deployed on **Vercel** with the native Next.js preset

## Approved assets

The hero motion is built from two manually approved reference images. **Do not
regenerate, replace, rename or modify them.**

| Purpose            | Path                                        |
| ------------------ | ------------------------------------------- |
| Start frame (src)  | `references/martinbarber-start-novy.png`    |
| End frame (src)    | `references/martinbarber-end-novy.png`      |
| Start (web copy)   | `public/images/martinbarber-start.png`      |
| End (web copy)     | `public/images/martinbarber-end.png`        |
| Hero video         | `public/hero.mp4` (source: `assets/generated/hero.mp4`) |
| Canvas frames      | `public/frames/frame_0001.jpg … frame_0192.jpg` |
| Poster             | `public/images/hero-poster.jpg`             |
| Gallery frames     | `public/images/gallery/gallery-01…04.jpg`   |

## Local development

```bash
npm install
npm run verify:assets   # confirm all frames / images exist and FRAME_COUNT matches
npm run dev             # http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

### Useful scripts

| Script                  | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Start the dev server                                 |
| `npm run build`         | Production build                                     |
| `npm run start`         | Serve the production build                           |
| `npm run lint`          | ESLint (`eslint-config-next`)                        |
| `npm run typecheck`     | `tsc --noEmit`                                        |
| `npm run verify:assets` | Verify frame sequence, poster and images are present |

## Node version

The project targets **Node.js 24.x** (`engines.node` in `package.json` and
`.nvmrc`). Use `nvm use` locally.

## Deployment (Vercel)

The site deploys with the standard Next.js preset — no custom output directory,
no custom server.

```bash
npx vercel@latest login        # if not already authenticated
npx vercel@latest link --yes --project martinbarber
npx vercel@latest build
npx vercel@latest deploy --yes         # Preview
npx vercel@latest deploy --prod --yes  # Production
```

`vercel.json` sets long-lived immutable cache headers for `/frames`, `/images`
and `/hero.mp4`, plus baseline security headers.

### The Vercel build never runs Higgsfield or FFmpeg

All frames already exist in `public/frames` and are committed to the repository.
The hero video was generated once (via the Higgsfield MCP) and the frames were
extracted once (via FFmpeg) **outside** the deployment pipeline. The Vercel
build only compiles the Next.js app. `.vercelignore` excludes the raw
development assets (`frames/`, `assets/generated/`, `references/`).

## Environment variables

| Variable               | Required | Purpose                                       |
| ---------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical site URL for metadata / sitemap / robots / JSON-LD |

When `NEXT_PUBLIC_SITE_URL` is empty, the site derives its URL from Vercel
system variables in this order: `VERCEL_PROJECT_PRODUCTION_URL` →
`VERCEL_URL` → `http://localhost:3000` (see `app/lib/siteUrl.ts`). Set
`NEXT_PUBLIC_SITE_URL` once a custom domain is connected. See `.env.example`.

## Replacing business details later

Business contact details are intentionally left as placeholders (no invented
phone number, address, hours, prices, reviews or social links). Update them in
one place — `app/lib/siteConfig.ts`:

- `phone` — currently empty; the contact block shows "Doplniť telefón"
- `address` — currently `"Prešov"`
- `instagramUrl` / `facebookUrl` — empty; footer/social links only render when set
- `openingHours` — empty array

## Regenerating the hero sequence later

1. Generate a new video from the two approved reference images with the
   Higgsfield MCP (image-to-video, `start_image` + `end_image`).
2. Extract frames locally:
   ```bash
   ffmpeg -i assets/generated/hero.mp4 -vf "fps=24,scale=1920:-2" -q:v 3 "public/frames/frame_%04d.jpg"
   ```
3. Update `FRAME_COUNT` in `app/lib/frameConfig.ts` to the new exact count.
4. Refresh `public/images/hero-poster.jpg` (frame 1) and the four
   `public/images/gallery/gallery-0X.jpg` frames.
5. Run `npm run verify:assets` and `npm run build`.

## Accessibility & performance

- Reduced-motion users get a static poster hero with all content and CTAs.
- Semantic HTML, visible keyboard focus, descriptive Slovak alt text.
- Canvas DPR capped at 2, controlled frame preloading concurrency, lazy-loaded
  below-the-fold imagery, no React state updates per animation frame.

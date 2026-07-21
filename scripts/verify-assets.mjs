#!/usr/bin/env node
/**
 * Pre-deployment asset verification.
 *
 * Ensures every asset the production site depends on already exists in the
 * repository, so the Vercel build never has to run Higgsfield or FFmpeg.
 *
 * Checks:
 *   - app/lib/frameConfig.ts can be resolved and parsed
 *   - public/frames/frame_0001.jpg exists
 *   - the expected final frame exists (frame_<FRAME_COUNT>.jpg)
 *   - public/images/hero-poster.jpg exists
 *   - both approved public images exist
 *   - FRAME_COUNT matches the real number of JPEG frames on disk
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  errors.push(msg);
  console.error(`  ✗ ${msg}`);
};

// 1. Resolve frameConfig.ts
const frameConfigPath = join(root, "app/lib/frameConfig.ts");
if (!existsSync(frameConfigPath)) {
  fail("app/lib/frameConfig.ts not found");
  process.exit(1);
}
const cfgSrc = readFileSync(frameConfigPath, "utf8");
const num = (name) => {
  const m = cfgSrc.match(new RegExp(`${name}\\s*=\\s*(\\d+)`));
  return m ? Number(m[1]) : NaN;
};
const str = (name) => {
  const m = cfgSrc.match(new RegExp(`${name}\\s*=\\s*["'\`]([^"'\`]+)["'\`]`));
  return m ? m[1] : null;
};

const FRAME_COUNT = num("FRAME_COUNT");
const FRAME_START_INDEX = num("FRAME_START_INDEX");
const FRAME_PADDING = num("FRAME_PADDING");
const FRAME_DIRECTORY = str("FRAME_DIRECTORY");

if (!Number.isInteger(FRAME_COUNT) || FRAME_COUNT <= 0) {
  fail(`FRAME_COUNT is not a valid positive integer (got ${FRAME_COUNT})`);
} else {
  ok(`frameConfig.ts resolved (FRAME_COUNT=${FRAME_COUNT}, padding=${FRAME_PADDING}, dir=${FRAME_DIRECTORY})`);
}

const pad = (n) => String(n).padStart(FRAME_PADDING || 4, "0");
const framesDir = join(root, "public/frames");

// 2 & 3. First and final frame
const firstFrame = join(framesDir, `frame_${pad(FRAME_START_INDEX || 1)}.jpg`);
const lastFrame = join(framesDir, `frame_${pad(FRAME_COUNT)}.jpg`);
existsSync(firstFrame)
  ? ok("public/frames/frame_0001.jpg exists")
  : fail("public/frames/frame_0001.jpg is missing");
existsSync(lastFrame)
  ? ok(`final frame frame_${pad(FRAME_COUNT)}.jpg exists`)
  : fail(`final frame frame_${pad(FRAME_COUNT)}.jpg is missing`);

// 4. Poster + approved images
const required = [
  "public/images/hero-poster.jpg",
  "public/images/martinbarber-start.png",
  "public/images/martinbarber-end.png",
];
for (const rel of required) {
  existsSync(join(root, rel))
    ? ok(`${rel} exists`)
    : fail(`${rel} is missing`);
}

// 5. FRAME_COUNT matches real JPEG count
let realCount = 0;
if (existsSync(framesDir)) {
  realCount = readdirSync(framesDir).filter((f) =>
    /^frame_\d+\.jpg$/.test(f),
  ).length;
}
if (realCount === FRAME_COUNT) {
  ok(`FRAME_COUNT matches on-disk JPEG count (${realCount})`);
} else {
  fail(
    `FRAME_COUNT (${FRAME_COUNT}) does not match on-disk JPEG count (${realCount})`,
  );
}

if (errors.length > 0) {
  console.error(`\nAsset verification FAILED with ${errors.length} error(s).`);
  process.exit(1);
}
console.log("\nAsset verification passed.");

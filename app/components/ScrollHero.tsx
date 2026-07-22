"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FRAME_COUNT,
  FRAME_START_INDEX,
  FRAME_PADDING,
  FRAME_DIRECTORY,
} from "../lib/frameConfig";

const MAX_CONCURRENT = 6;

function frameUrl(i: number): string {
  return `${FRAME_DIRECTORY}/frame_${String(i).padStart(FRAME_PADDING, "0")}.jpg`;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Opacity for an overlay that fades in and out across a scroll band. */
function band(
  p: number,
  start: number,
  fadeInEnd: number,
  fadeOutStart: number,
  end: number,
): number {
  if (p <= start || p >= end) return 0;
  if (p < fadeInEnd) return clamp01((p - start) / (fadeInEnd - start));
  if (p > fadeOutStart) return clamp01((end - p) / (end - fadeOutStart));
  return 1;
}

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  // Detect reduced-motion preference before wiring the canvas.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const total = FRAME_COUNT;
    const images = new Array<HTMLImageElement | null>(total + 1).fill(null);
    // 0 = unrequested, 1 = loading, 2 = loaded, 3 = errored
    const status = new Uint8Array(total + 1);
    const queue: number[] = [];
    let active = 0;
    let firstDrawn = false;
    let lastDrawnFrame = -1;
    let smoothed = 0;
    let raf = 0;
    let cssW = 0;
    let cssH = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnFrame = -1; // force redraw at new size
      drawNearest(currentTarget());
    }

    function drawImage(img: HTMLImageElement) {
      if (!ctx) return;
      ctx.fillStyle = "#f5e3be";
      ctx.fillRect(0, 0, cssW, cssH);
      const scale = Math.max(cssW / img.width, cssH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (cssW - w) / 2;
      const y = (cssH - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    }

    function nearestLoaded(target: number): number {
      if (status[target] === 2) return target;
      for (let d = 1; d <= total; d++) {
        const lo = target - d;
        const hi = target + d;
        if (lo >= 1 && status[lo] === 2) return lo;
        if (hi <= total && status[hi] === 2) return hi;
      }
      return -1;
    }

    function drawNearest(target: number) {
      const idx = nearestLoaded(target);
      if (idx === -1) return;
      if (idx === lastDrawnFrame) return;
      const img = images[idx];
      if (!img) return;
      drawImage(img);
      lastDrawnFrame = idx;
      if (!firstDrawn) {
        firstDrawn = true;
        setReady(true);
      }
    }

    function startLoad(i: number) {
      if (i < 1 || i > total || status[i] !== 0) return;
      status[i] = 1;
      active++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        images[i] = img;
        status[i] = 2;
        active--;
        // Draw immediately if this is the frame we currently want.
        if (i === currentTarget() || !firstDrawn) drawNearest(currentTarget());
        pump();
      };
      img.onerror = () => {
        status[i] = 3;
        active--;
        pump();
      };
      img.src = frameUrl(i);
    }

    function pump() {
      while (active < MAX_CONCURRENT && queue.length > 0) {
        const next = queue.shift() as number;
        if (status[next] === 0) startLoad(next);
      }
    }

    function enqueue(i: number, front = false) {
      if (i < 1 || i > total || status[i] !== 0) return;
      if (front) queue.unshift(i);
      else queue.push(i);
    }

    let currentTargetFrame = FRAME_START_INDEX;
    function currentTarget() {
      return currentTargetFrame;
    }

    function computeProgress(): number {
      const el = containerRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const denom = el.offsetHeight - window.innerHeight;
      if (denom <= 0) return 0;
      return clamp01(-rect.top / denom);
    }

    function tick() {
      const raw = computeProgress();
      smoothed += (raw - smoothed) * 0.12;
      if (Math.abs(raw - smoothed) < 0.0005) smoothed = raw;

      const target =
        Math.round(smoothed * (total - 1)) + FRAME_START_INDEX;
      currentTargetFrame = target;

      // Prioritise a window around the target frame.
      for (let i = target; i <= Math.min(total, target + 6); i++) {
        if (status[i] === 0) {
          enqueue(i, true);
        }
      }
      if (status[target - 1] === 0) enqueue(target - 1, true);
      pump();

      if (target !== lastDrawnFrame) drawNearest(target);

      // Overlay visibility driven directly (no React state per frame).
      const p = smoothed;
      if (phase1Ref.current) {
        const o = p < 0.2 ? 1 : band(p, 0.0, 0.001, 0.2, 0.3);
        phase1Ref.current.style.opacity = String(o);
        phase1Ref.current.style.transform = `translateY(${(1 - o) * -24}px)`;
        phase1Ref.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (phase2Ref.current) {
        const o = band(p, 0.34, 0.42, 0.56, 0.62);
        phase2Ref.current.style.opacity = String(o);
        phase2Ref.current.style.transform = `translateY(${(1 - o) * 18}px)`;
      }
      if (phase3Ref.current) {
        const o = band(p, 0.74, 0.82, 1.01, 1.02);
        phase3Ref.current.style.opacity = String(o);
        phase3Ref.current.style.transform = `translateY(${(1 - o) * 20}px)`;
        phase3Ref.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (indicatorRef.current) {
        const o = p < 0.1 ? clamp01(1 - p / 0.1) : 0;
        indicatorRef.current.style.opacity = String(o);
      }

      raf = window.requestAnimationFrame(tick);
    }

    // Build the initial priority queue: frame 1, first 24, then a strided sweep.
    enqueue(1);
    for (let i = 2; i <= Math.min(24, total); i++) enqueue(i);
    for (let step = 8; step >= 2; step = Math.floor(step / 2)) {
      for (let i = 1; i <= total; i += step) enqueue(i);
    }
    for (let i = 1; i <= total; i++) enqueue(i);

    resize();
    pump();
    raf = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img) {
          img.onload = null;
          img.onerror = null;
          images[i] = null;
        }
      }
    };
  }, [reduced]);

  // -------------------------------------------------------------- Reduced motion
  if (reduced) {
    return (
      <section
        aria-label="Martin Barber — úvod"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "#f5e3be",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-poster.jpg"
          alt="Interiér barbershopu Martin Barber v Prešove"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div className="hero-scrim" aria-hidden />
        <div className="container hero-content-static">
          <Phase1 innerRef={null} />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Martin Barber — úvod">
      <div ref={containerRef} className="hero-outer">
        <div ref={stickyRef} className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas" aria-hidden />
          {!ready && (
            <div className="hero-loading" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-poster.jpg" alt="" />
            </div>
          )}
          <div className="hero-scrim" aria-hidden />

          <div className="hero-overlays">
            <div ref={phase1Ref} className="hero-phase hero-phase-1">
              <div className="container">
                <Phase1 />
              </div>
            </div>

            <div
              ref={phase2Ref}
              className="hero-phase hero-phase-2"
              style={{ opacity: 0 }}
            >
              <div className="container hero-center">
                <p className="eyebrow">REMESLO V POHYBE</p>
                <h2 className="display hero-phase2-title">
                  Každý detail
                  <br />
                  má svoj význam.
                </h2>
              </div>
            </div>

            <div
              ref={phase3Ref}
              className="hero-phase hero-phase-3"
              style={{ opacity: 0 }}
            >
              <div className="container hero-right">
                <div className="hero-phase3-inner">
                  <p className="eyebrow">VITAJ V MARTIN BARBER</p>
                  <h2 className="display hero-phase3-title">
                    Sadni si.
                    <br />
                    O zvyšok sa postaráme.
                  </h2>
                  <p className="hero-body">
                    Čistý strih, upravená brada a výsledok, ktorý sedí tvojmu
                    štýlu.
                  </p>
                  <a href="#rezervacia" className="btn btn-primary">
                    Rezervovať návštevu
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div ref={indicatorRef} className="hero-indicator" aria-hidden>
            <span>Scroll to enter</span>
            <span className="hero-indicator-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Phase1({ innerRef }: { innerRef?: null } = {}) {
  void innerRef;
  return (
    <motion.div
      className="hero-phase1-inner"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
      }}
    >
      <Item>
        <p className="eyebrow">BARBERSHOP · PREŠOV</p>
      </Item>
      <Item>
        <h1 className="display hero-title">
          Martin
          <br />
          Barber
        </h1>
      </Item>
      <Item>
        <p className="hero-body hero-lead">
          Poctivý strih. Precízna brada.
          <br />
          Priestor, kde má každý detail svoj charakter.
        </p>
      </Item>
      <Item>
        <div className="hero-actions">
          <a href="#rezervacia" className="btn btn-primary">
            Rezervovať termín
          </a>
          <a href="#sluzby" className="btn btn-ghost">
            Objaviť priestor
          </a>
        </div>
      </Item>
    </motion.div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0, 0, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

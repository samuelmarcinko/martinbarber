"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/* Animated scissors that "snip" on a loop. Uses SVG SMIL animateTransform so
   the blades rotate around the exact pivot (50,79) reliably on every browser
   incl. iOS Safari — CSS transform-box on SVG groups is flaky there. */
export function ScissorsSnip({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      className={`scissors-snip ${className}`}
      viewBox="0 0 100 150"
      role="img"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        <circle cx="30" cy="122" r="13" />
        <line x1="42" y1="112" x2="72" y2="24" />
        {!reduce && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="-11 50 79; 1.5 50 79; -11 50 79"
            keyTimes="0; 0.5; 1"
            dur="2.1s"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            repeatCount="indefinite"
          />
        )}
      </g>
      <g>
        <circle cx="70" cy="122" r="13" />
        <line x1="58" y1="112" x2="28" y2="24" />
        {!reduce && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="11 50 79; -1.5 50 79; 11 50 79"
            keyTimes="0; 0.5; 1"
            dur="2.1s"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            repeatCount="indefinite"
          />
        )}
      </g>
      <circle cx="50" cy="79" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* A section-opener: two drifting barber-pole stripes flanking a snipping scissors. */
export function SnipDivider() {
  return (
    <div className="snip-divider" aria-hidden="true">
      <span className="snip-line" />
      <ScissorsSnip />
      <span className="snip-line" />
    </div>
  );
}

type Motif = "scissors" | "comb";

function MotifSvg({ variant }: { variant: Motif }) {
  if (variant === "comb") {
    return (
      <svg
        viewBox="0 0 240 80"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="8" y="8" width="224" height="20" rx="10" />
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={i} x1={20 + i * 10} y1={28} x2={20 + i * 10} y2={70} />
        ))}
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="28" cy="124" r="14" />
      <circle cx="72" cy="124" r="14" />
      <line x1="40" y1="114" x2="82" y2="16" />
      <line x1="60" y1="114" x2="18" y2="16" />
      <circle cx="50" cy="79" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Faint background barber-tool motif with a gentle scroll parallax drift. */
export function ToolBackdrop({
  variant,
  className = "",
  rotate = 0,
}: {
  variant: Motif;
  className?: string;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <motion.div
      ref={ref}
      className={`tool-backdrop ${className}`}
      style={{ y: reduce ? 0 : y }}
      aria-hidden="true"
    >
      <div className="tool-rot" style={{ transform: `rotate(${rotate}deg)` }}>
        {variant === "scissors" ? (
          <ScissorsSnip className="scissors-bg" />
        ) : (
          <MotifSvg variant="comb" />
        )}
      </div>
    </motion.div>
  );
}

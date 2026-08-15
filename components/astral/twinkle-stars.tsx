"use client";

import { GuideStar } from "@/components/astral/guide-star";

const NODES = [
  { x: 8, y: 42, s: 6, d: "0s" },
  { x: 18, y: 28, s: 4, d: "0.3s" },
  { x: 27, y: 54, s: 8, d: "0.6s" },
  { x: 38, y: 36, s: 5, d: "0.2s" },
  { x: 48, y: 58, s: 9, d: "0.8s" },
  { x: 58, y: 30, s: 5, d: "0.4s" },
  { x: 68, y: 50, s: 7, d: "1s" },
  { x: 78, y: 34, s: 4, d: "0.5s" },
  { x: 88, y: 56, s: 6, d: "0.7s" },
  { x: 94, y: 40, s: 3, d: "0.1s" },
];

const LINKS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [1, 3],
  [3, 5],
  [2, 4],
  [6, 8],
];

const DUST = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 23 + 4) % 100,
  y: 18 + ((i * 13) % 64),
  s: 1 + (i % 3),
  d: `${(i % 8) * 0.28}s`,
  lane: 72 + (i % 7) * 3,
}));

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden origin-bottom transition-all duration-700 ease-out ${
        gather ? "h-[18vh]" : "h-[46vh]"
      }`}
      aria-hidden
    >
      <div className="absolute -left-1/4 top-1/4 h-32 w-[70%] rounded-full bg-violet-500/15 blur-3xl animate-haze" />
      <div className="absolute right-0 top-1/3 h-28 w-[50%] rounded-full bg-sky-400/10 blur-3xl animate-haze" />

      <div className="absolute left-[-10%] top-[42%] h-[2px] w-[80%] bg-gradient-to-r from-transparent via-violet-300/40 to-transparent blur-[1px] animate-stream" />
      <div className="absolute left-[-5%] top-[56%] h-[3px] w-[90%] bg-gradient-to-r from-transparent via-sky-300/30 to-transparent blur-[2px] animate-stream-slow" />
      <div className="absolute left-[5%] top-[34%] h-px w-[70%] bg-gradient-to-r from-transparent via-violet-200/35 to-transparent animate-stream" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {LINKS.map(([a, b], i) => {
          const from = NODES[a];
          const to = NODES[b];
          return (
            <line
              key={i}
              x1={gather ? 50 : from.x}
              y1={gather ? 78 : from.y}
              x2={gather ? 50 : to.x}
              y2={gather ? 92 : to.y}
              stroke="rgba(167,139,250,0.35)"
              strokeWidth="0.22"
              className="transition-all duration-700 ease-out"
            />
          );
        })}
      </svg>

      {NODES.map((n, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-violet-100 shadow-[0_0_12px_rgba(167,139,250,0.8)] transition-all duration-700 ease-out ${
            gather ? "" : "animate-pulseGlow"
          }`}
          style={{
            width: gather ? Math.max(3, n.s * 0.55) : n.s,
            height: gather ? Math.max(3, n.s * 0.55) : n.s,
            left: gather ? "50%" : `${n.x}%`,
            top: gather ? `${70 + (i % 5) * 5}%` : `${n.y}%`,
            transform: "translate(-50%, -50%)",
            animationDelay: n.d,
          }}
        />
      ))}

      {DUST.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-sky-100/80 transition-all duration-700 ease-out ${
            gather ? "" : "animate-twinkle"
          }`}
          style={{
            width: p.s,
            height: p.s,
            left: gather ? "50%" : `${p.x}%`,
            top: gather ? `${p.lane}%` : `${p.y}%`,
            transform: gather ? "translate(-50%, 0)" : undefined,
            animationDelay: p.d,
            boxShadow: "0 0 8px rgba(186,230,253,0.7)",
          }}
        />
      ))}

      {gather ? (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_0_16px_rgba(125,211,252,0.85)]">
          <GuideStar />
        </span>
      ) : null}
    </div>
  );
}

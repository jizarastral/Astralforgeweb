"use client";

const NODES = [
  { x: 10, y: 28, r: 3 },
  { x: 18, y: 58, r: 2 },
  { x: 26, y: 38, r: 4 },
  { x: 34, y: 72, r: 2 },
  { x: 42, y: 44, r: 3 },
  { x: 50, y: 62, r: 5 },
  { x: 58, y: 32, r: 3 },
  { x: 66, y: 70, r: 2 },
  { x: 74, y: 40, r: 4 },
  { x: 82, y: 56, r: 3 },
  { x: 90, y: 30, r: 2 },
  { x: 88, y: 76, r: 3 },
];

const LINKS: Array<[number, number]> = [
  [0, 2],
  [2, 1],
  [2, 4],
  [4, 5],
  [5, 3],
  [5, 7],
  [4, 6],
  [6, 8],
  [8, 9],
  [9, 10],
  [9, 11],
  [6, 9],
  [1, 3],
];

const DUST = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 27 + 8) % 100,
  y: (i * 17 + 12) % 88,
  s: 1 + (i % 3),
  delay: `${(i % 9) * 0.18}s`,
  lane: 58 + (i % 8) * 4,
}));

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[40vh]" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#07070b] to-transparent" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {LINKS.map(([a, b], i) => {
          const from = NODES[a];
          const to = NODES[b];
          const x1 = gather ? 50 : from.x;
          const y1 = gather ? 78 : from.y;
          const x2 = gather ? 50 : to.x;
          const y2 = gather ? 92 : to.y;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(196,181,253,0.45)"
              strokeWidth="0.28"
              className="transition-all duration-700 ease-out"
            />
          );
        })}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={gather ? 50 : n.x}
            cy={gather ? 62 + (i % 6) * 5 : n.y}
            r={gather ? Math.max(1.2, n.r * 0.7) : n.r}
            fill="rgba(221,214,254,0.95)"
            className={`origin-center ${gather ? "transition-all duration-700 ease-out" : "animate-pulseGlow"}`}
            style={{ transitionDelay: gather ? `${i * 35}ms` : undefined }}
          />
        ))}
      </svg>

      {DUST.map((p, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-violet-100 shadow-[0_0_10px_rgba(196,181,253,0.85)] transition-all duration-700 ease-out ${
            gather ? "" : "animate-twinkle animate-drift"
          }`}
          style={{
            width: p.s,
            height: p.s,
            left: gather ? "50%" : `${p.x}%`,
            top: gather ? `${p.lane}%` : `${p.y}%`,
            opacity: gather ? 0.9 : 0.7,
            transform: gather ? "translate(-50%, 0)" : undefined,
            animationDelay: p.delay,
            transitionDelay: `${i * 12}ms`,
          }}
        />
      ))}

      <span
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${
          gather ? "bottom-3 animate-bounce" : "bottom-[22%] animate-pulse"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 4 L38 24 L58 24 L42 36 L48 56 L32 44 L16 56 L22 36 L6 24 L26 24 Z"
            stroke="#c4b5fd"
            strokeWidth="2"
            fill="rgba(167,139,250,0.55)"
          />
        </svg>
      </span>
    </div>
  );
}

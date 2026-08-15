"use client";

const DOTS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 19 + 8) % 90}%`,
  size: 1 + (i % 3),
  delay: `${(i % 7) * 0.35}s`,
}));

export function TwinkleStars() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[36vh]" aria-hidden>
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-violet-100/80 animate-twinkle"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            boxShadow: "0 0 8px rgba(196,181,253,0.7)",
          }}
        />
      ))}
    </div>
  );
}

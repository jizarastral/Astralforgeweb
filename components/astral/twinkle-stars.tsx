"use client";

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[42vh]" aria-hidden>
      <div
        className={`absolute inset-0 origin-bottom transition-transform duration-700 ease-out ${
          gather ? "translate-y-10 scale-y-125" : "translate-y-0 scale-y-100"
        }`}
      >
        <img
          src="/astral/flow/glow/0040.jpg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            gather ? "opacity-40" : "opacity-90"
          }`}
        />
        <img
          src="/astral/flow/glow/0080.jpg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            gather ? "opacity-95" : "opacity-0"
          }`}
        />
      </div>

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07070b] to-transparent" />

      <span
        className={`absolute left-1/2 -translate-x-1/2 drop-shadow-[0_0_18px_rgba(125,211,252,0.85)] transition-all duration-700 ease-out ${
          gather ? "bottom-4 animate-bounce" : "bottom-[28%] opacity-90"
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 2 L37 24 L60 24 L42 36 L48 58 L32 44 L16 58 L22 36 L4 24 L27 24 Z"
            stroke="#7dd3fc"
            strokeWidth="2"
            fill="rgba(125,211,252,0.55)"
          />
        </svg>
      </span>
    </div>
  );
}

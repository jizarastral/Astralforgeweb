"use client";

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[32vh]" aria-hidden>
      <img
        src="/astral/flow/under/open.jpg"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
          gather ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src="/astral/flow/under/down.jpg"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
          gather ? "translate-y-2 opacity-100" : "translate-y-0 opacity-0"
        }`}
      />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07070b] to-transparent" />
    </div>
  );
}

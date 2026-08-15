"use client";

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[32vh] transition-opacity duration-500 ${
        gather ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <img
        src="/astral/flow/under/open.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07070b] to-transparent" />
    </div>
  );
}

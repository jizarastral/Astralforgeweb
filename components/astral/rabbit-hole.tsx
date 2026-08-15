"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const beats = [
  {
    id: "enter",
    src: "/astral/forge-enter.jpg",
    title: "The chat is only the door.",
    line: "",
    place: "center" as const,
  },
  {
    id: "anvil",
    src: "/astral/forge-anvil.jpg",
    title: "Then the work.",
    line: "",
    place: "left" as const,
  },
  {
    id: "rest",
    src: "/astral/hammer-rest.jpg",
    title: "From drawing to delivery.",
    line: "",
    place: "right" as const,
  },
  {
    id: "raise",
    src: "/astral/hammer-raise.jpg",
    title: "",
    line: "",
    place: "center" as const,
  },
  {
    id: "strike",
    src: "/astral/hammer-strike.jpg",
    title: "",
    line: "",
    place: "center" as const,
  },
  {
    id: "mark",
    src: "/astral/hammer-mark.jpg",
    title: "",
    line: "",
    place: "center" as const,
  },
  {
    id: "logo",
    src: "/astral/logo-star.jpg",
    title: "Astral",
    line: "",
    place: "center" as const,
    logo: true,
  },
];

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function layerOpacity(progress: number, index: number, total: number) {
  const center = (index + 0.5) / total;
  const half = 0.78 / total;
  if (index === 0 && progress <= center) return 1;
  if (index === total - 1 && progress >= center) return 1;
  return clamp(1 - Math.abs(progress - center) / half);
}

export function RabbitHole() {
  const track = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 1) {
        setProgress(0);
        return;
      }
      setProgress(clamp(-el.getBoundingClientRect().top / total));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="hole" ref={track} className="relative h-[620vh] bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {beats.map((beat, index) => {
          const opacity = layerOpacity(progress, index, beats.length);
          const last = index === beats.length - 1;
          const place =
            beat.place === "left"
              ? "items-start text-left"
              : beat.place === "right"
                ? "items-end text-right"
                : "items-center text-center";

          return (
            <div
              key={beat.id}
              className="absolute inset-0"
              style={{
                opacity,
                zIndex: index + 1,
                pointerEvents: last && opacity > 0.6 ? "auto" : "none",
              }}
            >
              <img
                src={beat.src}
                alt=""
                className={
                  beat.logo
                    ? "absolute inset-0 h-full w-full bg-black object-contain p-24 md:p-40"
                    : "absolute inset-0 h-full w-full object-cover"
                }
              />

              {beat.logo ? null : (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
              )}

              <div
                className={`absolute inset-x-0 bottom-0 flex flex-col px-8 pb-16 md:px-20 md:pb-20 ${place}`}
              >
                {beat.title ? (
                  <h2 className="max-w-xl font-[family-name:var(--font-story)] text-4xl font-light leading-[1.05] text-white md:text-6xl">
                    {beat.title}
                  </h2>
                ) : null}
                {last ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/#chat"
                      className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Back to chat
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/30 px-5 py-2.5 text-sm text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      Request a build
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

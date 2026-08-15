"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const beats = [
  { id: "leave", src: "/astral/flow/01-leave.jpg", title: "", logo: false },
  { id: "farm", src: "/astral/flow/02-farm.jpg", title: "", logo: false },
  { id: "layers", src: "/astral/flow/03-layers.jpg", title: "", logo: false },
  { id: "core", src: "/astral/flow/04-core.jpg", title: "", logo: false },
  {
    id: "mark",
    src: "/astral/flow/05-mark.jpg",
    title: "",
    logo: false,
  },
];

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function layerOpacity(progress: number, index: number, total: number) {
  const center = (index + 0.5) / total;
  const half = 0.8 / total;
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
    <section id="hole" ref={track} className="relative h-[520vh] bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {beats.map((beat, index) => {
          const opacity = layerOpacity(progress, index, beats.length);
          const last = index === beats.length - 1;
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
                className="absolute inset-0 h-full w-full object-cover"
              />
              {last ? (
                <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center gap-3">
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
          );
        })}
      </div>
    </section>
  );
}

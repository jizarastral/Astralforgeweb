"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

export function RabbitHole() {
  const track = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [end, setEnd] = useState(false);
  const duration = useRef(0);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const ready = () => {
      duration.current = node.duration || 0;
    };
    if (node.readyState >= 1) ready();
    node.addEventListener("loadedmetadata", ready);

    let raf = 0;
    const update = () => {
      const el = track.current;
      if (!el || !node) return;
      const total = el.offsetHeight - window.innerHeight;
      const progress = total <= 1 ? 0 : clamp(-el.getBoundingClientRect().top / total);
      setEnd(progress > 0.94);
      const len = duration.current || node.duration || 0;
      if (len > 0) {
        const t = progress * (len - 0.04);
        if (Math.abs(node.currentTime - t) > 0.02) node.currentTime = t;
      }
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
      node.removeEventListener("loadedmetadata", ready);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="hole" ref={track} className="relative h-[420vh] bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/astral/flow/journey.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        {end ? (
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
    </section>
  );
}

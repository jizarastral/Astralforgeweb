"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { REEL_COUNT, reelSrc } from "@/lib/explore-reel";

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const ir = img.width / img.height;
  const cr = w / h;
  let dw = w;
  let dh = h;
  let dx = 0;
  let dy = 0;
  if (ir > cr) {
    dw = h * ir;
    dx = (w - dw) / 2;
  } else {
    dh = w / ir;
    dy = (h - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function RabbitHole() {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cache = useRef<Map<number, HTMLImageElement>>(new Map());
  const pending = useRef<Set<number>>(new Set());
  const indexRef = useRef(0);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const load = (i: number) => {
      if (i < 0 || i >= REEL_COUNT) return;
      if (cache.current.has(i) || pending.current.has(i)) return;
      pending.current.add(i);
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        cache.current.set(i, img);
        pending.current.delete(i);
        if (i === indexRef.current) paint(i);
      };
      img.onerror = () => pending.current.delete(i);
      img.src = reelSrc(i);
    };

    const paint = (i: number) => {
      const node = canvas.current;
      if (!node) return;
      const ctx = node.getContext("2d");
      if (!ctx) return;
      const img = cache.current.get(i) ?? cache.current.get(i - 1) ?? cache.current.get(i + 1);
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (node.width !== Math.floor(w * dpr) || node.height !== Math.floor(h * dpr)) {
        node.width = Math.floor(w * dpr);
        node.height = Math.floor(h * dpr);
        node.style.width = `${w}px`;
        node.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      coverDraw(ctx, img, w, h);
    };

    const around = (i: number) => {
      load(i);
      for (let k = 1; k <= 8; k++) {
        load(i + k);
        load(i - k);
      }
    };

    let raf = 0;
    const update = () => {
      const el = track.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const progress = total <= 1 ? 0 : clamp(-el.getBoundingClientRect().top / total);
      const next = Math.min(REEL_COUNT - 1, Math.round(progress * (REEL_COUNT - 1)));
      indexRef.current = next;
      setEnd(progress > 0.92);
      around(next);
      paint(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    around(0);
    update();

    let warm = 0;
    const idle = () => {
      if (warm >= REEL_COUNT) return;
      load(warm);
      warm += 1;
      if (warm < REEL_COUNT) window.setTimeout(idle, 16);
    };
    const warmId = window.setTimeout(idle, 120);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(warmId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="hole"
      ref={track}
      className="relative bg-black"
      style={{ height: `${100 + REEL_COUNT * 8}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
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

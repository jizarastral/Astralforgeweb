"use client";

import { useEffect, useRef } from "react";
import { GuideStar } from "@/components/astral/guide-star";
import { GLOW_COUNT, glowSrc } from "@/lib/glow-reel";

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
    dy = (h - dh) * 0.55;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    const cache = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    let index = 0;
    let raf = 0;
    let last = 0;

    const load = (i: number) => {
      const n = ((i % GLOW_COUNT) + GLOW_COUNT) % GLOW_COUNT;
      if (cache.has(n) || pending.has(n)) return;
      pending.add(n);
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        cache.set(n, img);
        pending.delete(n);
      };
      img.onerror = () => pending.delete(n);
      img.src = glowSrc(n);
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = Math.max(160, node.clientHeight);
      node.width = Math.floor(w * dpr);
      node.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      const w = node.clientWidth;
      const h = node.clientHeight;
      const img = cache.get(index) ?? cache.get((index + GLOW_COUNT - 1) % GLOW_COUNT);
      ctx.clearRect(0, 0, w, h);
      if (!img) return;
      coverDraw(ctx, img, w, h);
    };

    const tick = (now: number) => {
      if (!last) last = now;
      if (now - last > 95) {
        index = (index + 1) % GLOW_COUNT;
        last = now;
        load(index + 1);
        load(index + 2);
      }
      paint();
      raf = requestAnimationFrame(tick);
    };

    size();
    for (let i = 0; i < 10; i++) load(i);
    let warm = 0;
    const idle = () => {
      if (warm >= GLOW_COUNT) return;
      load(warm);
      warm += 1;
      if (warm < GLOW_COUNT) window.setTimeout(idle, 18);
    };
    const warmId = window.setTimeout(idle, 60);
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(warmId);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 origin-bottom transition-all duration-700 ease-out ${
        gather ? "h-[20vh]" : "h-[46vh]"
      }`}
      aria-hidden
    >
      <div className="absolute inset-0 animate-drift">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#07070b] via-[#07070b]/70 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,11,0.55)_100%)]" />
      {gather ? (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_0_16px_rgba(125,211,252,0.8)]">
          <GuideStar />
        </span>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
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
    dy = (h - dh) * 0.58;
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
    let alive = true;

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
      const img = cache.get(index) ?? cache.get(0);
      ctx.clearRect(0, 0, w, h);
      if (!img) return;
      coverDraw(ctx, img, w, h);
    };

    const tick = (now: number) => {
      if (!alive) return;
      if (!last) last = now;
      if (now - last > 90) {
        index = (index + 1) % GLOW_COUNT;
        last = now;
        load(index + 1);
        load(index + 2);
      }
      paint();
      raf = requestAnimationFrame(tick);
    };

    size();
    load(0);
    load(1);
    load(2);
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", size);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 origin-bottom transition-all duration-700 ease-out ${
        gather ? "h-[22vh] translate-y-2" : "h-[48vh]"
      }`}
      aria-hidden
    >
      <img
        src={glowSrc(0)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07070b] to-transparent" />
    </div>
  );
}

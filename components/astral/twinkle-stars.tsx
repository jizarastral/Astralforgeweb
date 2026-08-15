"use client";

import { useEffect, useRef } from "react";

export function TwinkleStars() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Star = { x: number; y: number; r: number; a: number; s: number };
    let stars: Star[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = Math.max(180, Math.floor(window.innerHeight * 0.38));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 42 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.25,
        a: Math.random() * 0.7 + 0.15,
        s: 0.6 + Math.random() * 1.8,
      }));
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const star of stars) {
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * star.s + star.x));
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 228, 255, ${star.a * twinkle})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
    />
  );
}

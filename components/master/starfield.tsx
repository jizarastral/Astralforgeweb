"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Subtle interactive starfield — performance-friendly canvas ambient. */
export function Starfield() {
  const pathname = usePathname();
  const ref = useRef<HTMLCanvasElement>(null);
  const home = pathname === "/";

  useEffect(() => {
    if (home) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; z: number; r: number; a: number };
    let stars: Star[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(160, Math.floor((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.6 + 0.15,
      }));
    };

    let t = 0;
    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 4 + s.x);
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 220, 255, ${s.a * twinkle})`;
        ctx.arc(s.x, s.y + Math.sin(t + s.z * 10) * 0.4, s.r, 0, Math.PI * 2);
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
  }, [home]);

  if (home) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}

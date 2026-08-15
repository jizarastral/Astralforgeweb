"use client";

import { useEffect, useRef } from "react";

type Spark = {
  a: number;
  r: number;
  s: number;
  size: number;
  hue: number;
};

export function ComingSoon() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let alive = true;
    const sparks: Spark[] = [];

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      node.width = Math.floor(w * dpr);
      node.height = Math.floor(h * dpr);
      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparks.length = 0;
      const n = Math.min(180, Math.floor((w * h) / 9000));
      for (let i = 0; i < n; i++) {
        sparks.push({
          a: Math.random() * Math.PI * 2,
          r: 40 + Math.random() * Math.min(w, h) * 0.48,
          s: 0.0012 + Math.random() * 0.0024,
          size: 0.5 + Math.random() * 1.8,
          hue: Math.random() > 0.35 ? 250 : 200,
        });
      }
    };

    const draw = () => {
      if (!alive) return;
      t += 1;
      const cx = w / 2;
      const cy = h / 2 - 24;
      ctx.fillStyle = "rgba(6, 6, 8, 0.28)";
      ctx.fillRect(0, 0, w, h);

      const fog = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h) * 0.55);
      fog.addColorStop(0, "rgba(70, 50, 160, 0.14)");
      fog.addColorStop(0.45, "rgba(20, 24, 60, 0.06)");
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, w, h);

      const ring = 90 + Math.sin(t * 0.012) * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, ring, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(170, 160, 255, ${0.18 + 0.1 * Math.sin(t * 0.02)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, ring * 1.7, t * 0.004, t * 0.004 + Math.PI * 1.2);
      ctx.strokeStyle = "rgba(125, 200, 255, 0.12)";
      ctx.stroke();

      for (const s of sparks) {
        s.a += s.s;
        const wobble = Math.sin(t * 0.01 + s.r) * 6;
        const x = cx + Math.cos(s.a) * (s.r + wobble);
        const y = cy + Math.sin(s.a) * (s.r * 0.55 + wobble * 0.4);
        const pulse = 0.25 + 0.75 * Math.abs(Math.sin(t * 0.02 + s.a));
        ctx.fillStyle =
          s.hue > 220
            ? `rgba(196, 181, 253, ${0.25 + pulse * 0.55})`
            : `rgba(186, 230, 253, ${0.2 + pulse * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size * (0.7 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      const core = 10 + Math.sin(t * 0.03) * 2;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70);
      glow.addColorStop(0, "rgba(230, 240, 255, 0.95)");
      glow.addColorStop(0.2, "rgba(160, 200, 255, 0.45)");
      glow.addColorStop(1, "rgba(80, 60, 180, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(t * 0.008) * 0.08);
      ctx.fillStyle = "#e0f2fe";
      ctx.beginPath();
      const k = core * 1.15;
      ctx.moveTo(0, -k);
      ctx.lineTo(k * 0.22, -k * 0.18);
      ctx.lineTo(k, -k * 0.16);
      ctx.lineTo(k * 0.28, k * 0.12);
      ctx.lineTo(k * 0.52, k);
      ctx.lineTo(0, k * 0.38);
      ctx.lineTo(-k * 0.52, k);
      ctx.lineTo(-k * 0.28, k * 0.12);
      ctx.lineTo(-k, -k * 0.16);
      ctx.lineTo(-k * 0.22, -k * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    layout();
    ctx.fillStyle = "#060608";
    ctx.fillRect(0, 0, w, h);
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", layout);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#060608] text-white">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/20 via-transparent to-[#060608]/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="animate-[twinkle_3s_ease-in-out_infinite] text-[11px] tracking-[0.42em] text-white/40">
          ASTRAL FORGE
        </p>
        <h1 className="mt-5 max-w-xl text-5xl font-light tracking-tight text-white md:text-7xl">
          Coming soon
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-white/50">
          A simple chat on the surface. A larger intelligence underneath.
        </p>
        <a
          href="mailto:astralfconsulting@gmail.com"
          className="mt-10 inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 text-sm tracking-[0.16em] text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white"
        >
          astralfconsulting@gmail.com
        </a>
      </div>
    </main>
  );
}

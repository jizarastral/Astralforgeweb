"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; ox: number; oy: number; r: number; phase: number };
type Spark = { x: number; y: number; vx: number; life: number; size: number };

export function TwinkleStars({ gather = false }: { gather?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const gatherRef = useRef(gather);
  gatherRef.current = gather;

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

    const nodes: Node[] = [];
    const sparks: Spark[] = [];

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = node.clientWidth;
      h = Math.max(160, node.clientHeight);
      node.width = Math.floor(w * dpr);
      node.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes.length = 0;
      const count = Math.max(14, Math.floor(w / 90));
      for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w * 0.92 + w * 0.04;
        const y = h * (0.38 + Math.sin(i * 0.7) * 0.16 + (i % 3) * 0.06);
        nodes.push({
          x,
          y,
          ox: x,
          oy: y,
          r: 2.2 + (i % 5) * 1.4,
          phase: i * 0.55,
        });
      }
      sparks.length = 0;
      for (let i = 0; i < 70; i++) {
        sparks.push({
          x: Math.random() * w,
          y: h * (0.28 + Math.random() * 0.5),
          vx: 0.35 + Math.random() * 0.7,
          life: Math.random(),
          size: 0.6 + Math.random() * 1.6,
        });
      }
    };

    const waveY = (x: number, band: number) => {
      return (
        h * (0.42 + band * 0.08) +
        Math.sin(x * 0.008 + t * 0.018 + band * 1.4) * h * 0.07 +
        Math.sin(x * 0.003 - t * 0.01) * h * 0.03
      );
    };

    const draw = () => {
      if (!alive) return;
      t += 1;
      const g = gatherRef.current;
      ctx.clearRect(0, 0, w, h);

      const haze = ctx.createRadialGradient(w * 0.55, h * 0.5, 10, w * 0.55, h * 0.55, w * 0.6);
      haze.addColorStop(0, "rgba(80, 60, 180, 0.16)");
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      for (let band = 0; band < 5; band++) {
        ctx.beginPath();
        ctx.moveTo(0, waveY(0, band));
        for (let x = 0; x <= w; x += 8) {
          ctx.lineTo(x, waveY(x, band));
        }
        ctx.strokeStyle = `rgba(${120 + band * 20}, ${150 + band * 12}, 255, ${0.08 + band * 0.03})`;
        ctx.lineWidth = 1.1 + band * 0.25;
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(170, 160, 255, 0.22)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        if (i + 2 < nodes.length) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(nodes[i + 2].x, nodes[i + 2].y);
          ctx.strokeStyle = "rgba(140, 180, 255, 0.1)";
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const tx = g ? w * 0.5 : n.ox;
        const ty = g ? h * 0.82 + Math.sin(n.phase) * 8 : n.oy;
        n.x += (tx - n.x) * 0.06;
        n.y += (ty - n.y) * 0.06;
        const glow = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.03 + n.phase));
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        grd.addColorStop(0, `rgba(220, 210, 255, ${0.85 * glow})`);
        grd.addColorStop(0.35, `rgba(150, 140, 255, ${0.35 * glow})`);
        grd.addColorStop(1, "rgba(80, 60, 180, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(235, 230, 255, ${0.7 + glow * 0.3})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of sparks) {
        if (g) {
          s.x += (w * 0.5 - s.x) * 0.04;
          s.y += (h * 0.88 - s.y) * 0.04;
        } else {
          s.x += s.vx;
          s.y += Math.sin(t * 0.02 + s.x * 0.01) * 0.25;
          if (s.x > w + 8) {
            s.x = -8;
            s.y = h * (0.28 + Math.random() * 0.5);
          }
        }
        s.life += 0.012;
        const a = 0.25 + 0.55 * Math.abs(Math.sin(s.life * 4));
        ctx.fillStyle = `rgba(200, 210, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (g) {
        const sx = w * 0.5;
        const sy = h * 0.9;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 28);
        sg.addColorStop(0, "rgba(180, 230, 255, 0.95)");
        sg.addColorStop(1, "rgba(125, 211, 252, 0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sx, sy, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e0f2fe";
        ctx.beginPath();
        ctx.moveTo(sx, sy - 9);
        ctx.lineTo(sx + 2.2, sy - 1.5);
        ctx.lineTo(sx + 9, sy - 1.5);
        ctx.lineTo(sx + 3.4, sy + 2.4);
        ctx.lineTo(sx + 5.4, sy + 9);
        ctx.lineTo(sx, sy + 4.6);
        ctx.lineTo(sx - 5.4, sy + 9);
        ctx.lineTo(sx - 3.4, sy + 2.4);
        ctx.lineTo(sx - 9, sy - 1.5);
        ctx.lineTo(sx - 2.2, sy - 1.5);
        ctx.closePath();
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    layout();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", layout);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 origin-bottom transition-all duration-700 ease-out ${
        gather ? "h-[22vh]" : "h-[48vh]"
      }`}
      aria-hidden
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#07070b] to-transparent" />
    </div>
  );
}

"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ShoppingBag } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatPrice, SHOP_ALL_URL } from "@/lib/shopify";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Shortest signed offset on a loop (for horizontal carousel order). */
function signedOffset(i: number, active: number, len: number) {
  const raw = i - active;
  if (len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

type Props = {
  products: ShopifyProduct[];
  autoAdvance?: boolean;
  intervalMs?: number;
  /** How many cards visible on each side of the active card */
  sideCount?: number;
  cardWidth?: number;
  /** Horizontal spacing between card centers */
  spacing?: number;
  /** Max rotateY (deg) at outer edge of visible set */
  maxRotateY?: number;
};

/**
 * Horizontal product carousel:
 * - Cards sit on a horizontal plane (perspective stage)
 * - Cards move left/right on X
 * - Cards rotate around Y (rotateY) so the deck turns in that plane
 */
export function HorizontalProductCarousel({
  products,
  autoAdvance = true,
  intervalMs = 3400,
  sideCount = 2,
  cardWidth = 340,
  spacing = 240,
  maxRotateY = 52,
}: Props) {
  const reduceMotion = useReducedMotion();
  const len = products.length;
  const [active, setActive] = React.useState(0);
  const [hovering, setHovering] = React.useState(false);

  const prev = React.useCallback(() => {
    if (!len) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [len]);

  const next = React.useCallback(() => {
    if (!len) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [len]);

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len || hovering) return;
    const id = window.setInterval(next, Math.max(1200, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, reduceMotion, len, next]);

  if (!len) {
    return (
      <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
        No products loaded.{" "}
        <a href={SHOP_ALL_URL} className="text-cyan-300 underline">
          Open shop
        </a>
      </div>
    );
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (reduceMotion) return;
    const x = info.offset.x;
    const v = info.velocity.x;
    // swipe left → next, swipe right → prev
    if (x < -70 || v < -550) next();
    else if (x > 70 || v > 550) prev();
  };

  const stageHeight = Math.round(cardWidth * 1.22);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative mx-auto w-full max-w-6xl">
        {/* Stage: horizontal plane with perspective */}
        <div
          className="relative w-full select-none"
          style={{
            height: stageHeight + 40,
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
        >
          {/* floor / plane hint */}
          <div
            className="pointer-events-none absolute inset-x-[8%] bottom-6 h-24 rounded-[100%] bg-black/30 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-[15%] top-1/2 h-40 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
            aria-hidden
          />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {products.map((product, i) => {
              const offset = signedOffset(i, active, len);
              const abs = Math.abs(offset);
              if (abs > sideCount) return null;

              const isActive = offset === 0;
              // Horizontal travel on the plane
              const x = offset * spacing;
              // Slight arc so outer cards sit “on” the plane
              const y = abs * 10;
              // Rotate in the horizontal plane (yaw around Y)
              const rotateY =
                sideCount > 0
                  ? -offset * (maxRotateY / sideCount)
                  : 0;
              const z = -abs * 80;
              const scale = isActive ? 1 : Math.max(0.72, 1 - abs * 0.12);
              const opacity = isActive ? 1 : Math.max(0.35, 0.75 - abs * 0.2);
              const zIndex = 100 - abs;

              return (
                <motion.article
                  key={product.id}
                  className={cn(
                    "absolute overflow-hidden rounded-3xl border border-white/10 bg-card/95 shadow-2xl shadow-black/50 backdrop-blur-xl",
                    isActive
                      ? "cursor-grab ring-1 ring-amber-300/35 active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardWidth,
                    zIndex,
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                  }}
                  initial={false}
                  animate={{
                    x,
                    y,
                    rotateY: reduceMotion ? 0 : rotateY,
                    z,
                    scale,
                    opacity,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 260, damping: 30 }
                  }
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragEnd={isActive ? onDragEnd : undefined}
                  onClick={() => {
                    if (!isActive) setActive(i);
                  }}
                >
                  <div className="relative aspect-[4/3] bg-black/40">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
                      Astral shop
                    </div>
                    {product.price ? (
                      <div className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 px-3 py-1 text-xs font-semibold text-black">
                        {formatPrice(product.price)}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2.5 p-4">
                    <h3 className="line-clamp-2 min-h-[2.75rem] font-[family-name:var(--font-display)] text-base leading-snug text-foreground">
                      {product.title}
                    </h3>
                    {isActive ? (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-300 px-3 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Buy on Shopify
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Horizontal controls */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            aria-label="Previous product"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex max-w-[min(100%,420px)] items-center justify-center gap-1.5">
            {products.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === active
                    ? "w-7 bg-gradient-to-r from-amber-300 to-cyan-300"
                    : "w-1.5 bg-white/25 hover:bg-white/40",
                )}
                aria-label={`Go to ${p.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            aria-label="Next product"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </div>
  );
}

/** @deprecated use HorizontalProductCarousel — kept as alias for old imports */
export { HorizontalProductCarousel as VerticalProductStack };

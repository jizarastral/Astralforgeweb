"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ShoppingBag } from "lucide-react";
import { SHOP_HOME } from "@/lib/shopify";

export function MasterHero({ productCount }: { productCount: number }) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-28 md:px-8 md:pb-16 md:pt-36">
      <div className="mesh-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-40 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute left-[8%] top-52 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-amber-200/90 backdrop-blur"
          >
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            </span>
            Live · Forge + Shopify
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
            className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-glow sm:text-5xl md:text-6xl lg:text-7xl"
          >
            One brand.
            <br />
            <span className="gold-gradient animate-shimmer bg-gradient-to-r from-amber-200 via-yellow-300 via-50% to-cyan-300 bg-clip-text">
              Two engines.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            <strong className="font-medium text-foreground">AstralForge AE</strong>{" "}
            — drawings to G+20 HVAC, glass façades, fitout, MEP, and digital
            systems across the UAE.{" "}
            <strong className="font-medium text-foreground">Astral shop</strong>{" "}
            — live products at{" "}
            <a
              href={SHOP_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline-offset-4 hover:underline"
            >
              astralae.myshopify.com
            </a>
            .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-black shadow-xl shadow-amber-500/15"
            >
              <ShoppingBag className="h-4 w-4" />
              Enter the shop
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/what-we-do"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-foreground backdrop-blur transition hover:bg-white/10"
            >
              <Building2 className="h-4 w-4 text-cyan-300" />
              Explore the forge
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-3"
          >
            {[
              { k: String(productCount), v: "Shop SKUs" },
              { k: "15+", v: "Service lines" },
              { k: "G+20", v: "HVAC ready" },
            ].map((s) => (
              <div
                key={s.v}
                className="glass-strong rounded-2xl px-3 py-4 text-center"
              >
                <p className="font-[family-name:var(--font-display)] text-2xl text-amber-200">
                  {s.k}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {s.v}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/20 via-violet-500/15 to-cyan-400/20 blur-2xl" />
          <div className="glass-strong relative overflow-hidden rounded-[1.75rem] p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem]">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural glass façade — AstralForge AE"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
                <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/90">
                  Dual system
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="#forge"
                    className="rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur transition hover:bg-black/55"
                  >
                    <Building2 className="mb-2 h-4 w-4 text-amber-300" />
                    <p className="text-sm font-medium text-white">Forge AE</p>
                    <p className="mt-0.5 text-[11px] text-white/65">
                      Site & engineering
                    </p>
                  </a>
                  <a
                    href={SHOP_HOME}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur transition hover:bg-black/55"
                  >
                    <ShoppingBag className="mb-2 h-4 w-4 text-cyan-300" />
                    <p className="text-sm font-medium text-white">Shopify</p>
                    <p className="mt-0.5 text-[11px] text-white/65">
                      astralae store
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

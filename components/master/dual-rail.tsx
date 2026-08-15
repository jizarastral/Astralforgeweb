"use client";

import { Building2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/master/reveal";
import { SHOP_HOME } from "@/lib/shopify";
import Link from "next/link";

export function DualRail() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-10 md:px-8">
      <Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="#shop"
            className="group relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-transparent p-7 transition hover:border-cyan-300/35"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl transition group-hover:bg-cyan-400/25" />
            <ShoppingBag className="relative h-7 w-7 text-cyan-300" />
            <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
              Astral shop
            </h2>
            <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Everyday products, gadgets, and essentials — powered by Shopify,
              checkout worldwide.
            </p>
            <p className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-300">
              astralae.myshopify.com
              <ArrowUpRight className="h-4 w-4" />
            </p>
          </a>

          <Link
            href="/what-we-do"
            className="group relative overflow-hidden rounded-[1.75rem] border border-amber-300/20 bg-gradient-to-br from-amber-400/10 via-white/[0.03] to-transparent p-7 transition hover:border-amber-300/35"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl transition group-hover:bg-amber-400/25" />
            <Building2 className="relative h-7 w-7 text-amber-300" />
            <h2 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
              AstralForge AE
            </h2>
            <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Full engineering forge — drawings, glass, HVAC G+20, fitout, MEP,
              fire, security, LED, IT, 3D.
            </p>
            <p className="relative mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-200">
              View all services
              <ArrowUpRight className="h-4 w-4" />
            </p>
          </Link>
        </div>
      </Reveal>

      <div className="mt-4 text-center">
        <a
          href={SHOP_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground transition hover:text-cyan-300"
        >
          Prefer direct store access? Open Shopify →
        </a>
      </div>
    </section>
  );
}

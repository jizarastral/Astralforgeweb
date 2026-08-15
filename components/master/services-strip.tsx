"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { forgeServices } from "@/lib/forge-services";
import { Reveal } from "@/components/master/reveal";

export function ServicesStrip() {
  const featured = forgeServices.slice(0, 6);

  return (
    <section id="forge" className="relative section-pad mx-auto max-w-7xl">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-200/85">
              AstralForge AE
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-5xl">
              The forge, in full.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Multi-discipline delivery for developers, contractors, and brands
              across the UAE — from first line to handover.
            </p>
          </div>
          <Link
            href="/what-we-do"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            All services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.05}>
            <article className="group glass-strong overflow-hidden rounded-3xl">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="absolute bottom-3 left-4 font-[family-name:var(--font-display)] text-2xl text-white/90">
                  {s.code}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
                  {s.subtitle}
                </p>
                <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg">
                  {s.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

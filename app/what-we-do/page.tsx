import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/master/reveal";
import { FORGE, forgeServices, workSteps } from "@/lib/forge-services";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Full AstralForge AE service catalogue — drawings, aluminium & glass, HVAC G+20, MEP, fitout, fire, security, LED, IT, 3D and Astral shop.",
};

export default function WhatWeDoPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-32">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">
          Service catalogue
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl">
          What all we <span className="gold-gradient">do</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          One forge. Full stack. Site engineering across the UAE — and a live
          global shop under the same brand.
        </p>
      </Reveal>

      <section className="mt-16">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            From brief to handover
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.05}>
              <article className="glass-strong h-full rounded-2xl p-5">
                <p className="font-[family-name:var(--font-display)] text-2xl text-amber-300/80">
                  {s.step}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Full service lines
          </h2>
          <p className="mt-2 text-muted-foreground">
            {forgeServices.length} disciplines · site + shop
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {forgeServices.map((svc, i) => (
            <Reveal key={svc.id} delay={(i % 4) * 0.04}>
              <article className="glass-strong group overflow-hidden rounded-3xl">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={`${svc.title} — project photography`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <p className="absolute bottom-3 left-4 font-[family-name:var(--font-display)] text-3xl text-white/90">
                    {svc.code}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
                    {svc.subtitle}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {svc.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mt-16">
        <div className="glass-strong rounded-[2rem] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                Start a project
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Tell us the discipline — or a multi-package brief.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {FORGE.email}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Sales {FORGE.phones.sales}
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-300 px-6 py-3 text-sm font-semibold text-black"
            >
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

"use client";

import { workSteps } from "@/lib/forge-services";
import { Reveal } from "@/components/master/reveal";

export function ProcessSection() {
  return (
    <section id="process" className="relative section-pad mx-auto max-w-7xl">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/85">
          How we work
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-5xl">
          Brief → handover
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {workSteps.map((s, i) => (
          <Reveal key={s.step} delay={i * 0.07}>
            <div className="glass-strong relative h-full rounded-3xl p-6">
              <div className="absolute left-0 top-6 h-10 w-px bg-gradient-to-b from-amber-300 to-cyan-300 opacity-70" />
              <p className="font-[family-name:var(--font-display)] text-3xl text-amber-300/80">
                {s.step}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

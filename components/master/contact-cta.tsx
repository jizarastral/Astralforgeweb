"use client";

import Link from "next/link";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { FORGE } from "@/lib/forge-services";
import { SHOP_HOME } from "@/lib/shopify";
import { Reveal } from "@/components/master/reveal";

export function ContactCta() {
  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/15 via-background to-cyan-500/10 p-8 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200/90">
                Begin
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-5xl">
                Start a project.
                <br />
                <span className="gold-gradient">Or place an order.</span>
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Multi-discipline packages, fabrication, HVAC, or shop fulfilment
                — one team, two rails.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${FORGE.whatsapp.sales}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm transition hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  Sales WhatsApp
                </span>
                <span className="text-muted-foreground">{FORGE.phones.sales}</span>
              </a>
              <a
                href={`mailto:${FORGE.email}`}
                className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm transition hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  Email
                </span>
                <span className="truncate text-muted-foreground">{FORGE.email}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-300 px-4 py-3.5 text-sm font-semibold text-black"
              >
                Contact hub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SHOP_HOME}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-xs text-muted-foreground hover:text-cyan-300"
              >
                Shop checkout → astralae.myshopify.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

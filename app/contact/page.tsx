import type { Metadata } from "next";
import { Mail, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/master/reveal";
import { FORGE, forgeServices } from "@/lib/forge-services";
import { SHOP_HOME } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AstralForge AE — WhatsApp, email, Shopify store.",
};

export default function ContactPage() {
  const interests = forgeServices.map((s) => s.title).join("%0A- ");
  const mailBody = `Hello AstralForge AE,%0A%0AI am interested in:%0A- ${interests}%0A%0AProject notes:%0A`;
  const mailHref = `mailto:${FORGE.email}?subject=Project%20enquiry%20—%20AstralForge%20AE&body=${mailBody}`;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8 md:pt-32">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">
          Begin
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl">
          Start your <span className="gold-gradient">project</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Forge packages, multi-discipline site work, or shop orders — reach the
          right line.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <Reveal>
          <a
            href={mailHref}
            className="glass-strong flex h-full flex-col rounded-3xl p-6 transition hover:bg-white/[0.07]"
          >
            <Mail className="h-6 w-6 text-cyan-300" />
            <h2 className="mt-4 text-lg font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">{FORGE.email}</p>
          </a>
        </Reveal>
        <Reveal delay={0.05}>
          <a
            href={`https://wa.me/${FORGE.whatsapp.sales}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong flex h-full flex-col rounded-3xl p-6 transition hover:bg-white/[0.07]"
          >
            <MessageCircle className="h-6 w-6 text-emerald-300" />
            <h2 className="mt-4 text-lg font-semibold">Sales WhatsApp</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {FORGE.phones.sales}
            </p>
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={`https://wa.me/${FORGE.whatsapp.technical}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong flex h-full flex-col rounded-3xl p-6 transition hover:bg-white/[0.07]"
          >
            <Phone className="h-6 w-6 text-amber-200" />
            <h2 className="mt-4 text-lg font-semibold">Technical</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {FORGE.phones.technical}
            </p>
          </a>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            More lines
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              Client happiness:{" "}
              <a
                className="text-foreground hover:underline"
                href={`https://wa.me/${FORGE.whatsapp.happiness}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {FORGE.phones.happiness}
              </a>
            </li>
            <li className="flex flex-wrap items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-cyan-300" />
              Shopify:{" "}
              <a
                className="text-cyan-300 hover:underline"
                href={SHOP_HOME}
                target="_blank"
                rel="noopener noreferrer"
              >
                astralae.myshopify.com
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

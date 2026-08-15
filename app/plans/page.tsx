import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plans",
  description: "Free chat now. Paid plans next.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    note: "Live now",
    items: ["General chat", "Ask anything", "Explore the story"],
    href: "/",
    cta: "Open chat",
    current: true,
  },
  {
    name: "Pro",
    price: "Soon",
    note: "Payment next",
    items: ["Higher limits", "Saved threads", "Priority models"],
    href: "/contact",
    cta: "Join the list",
    current: false,
  },
  {
    name: "Team",
    price: "Soon",
    note: "Payment next",
    items: ["Shared workspace", "Company memory", "Admin controls"],
    href: "/contact",
    cta: "Talk to us",
    current: false,
  },
];

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-24 text-white">
      <p className="text-sm text-white/45">Pricing</p>
      <h1 className="mt-2 text-4xl font-light tracking-tight">Start free. Upgrade later.</h1>
      <p className="mt-3 max-w-xl text-white/55">
        Chat is open on the Free plan. Payment, higher limits, and team seats come next.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`flex flex-col rounded-3xl border p-6 ${
              p.current ? "border-white/30 bg-white/[0.04]" : "border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{p.name}</h2>
              <span className="text-[11px] tracking-wide text-white/40">{p.note}</span>
            </div>
            <p className="mt-4 text-3xl font-light">{p.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-white/60">
              {p.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href={p.href}
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 text-sm transition-colors duration-200 hover:bg-white/10"
            >
              {p.cta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

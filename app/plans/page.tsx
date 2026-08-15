"use client";

import Link from "next/link";
import { useState } from "react";

const paid = [
  {
    name: "Plus",
    tag: "Everyday",
    month: 19,
    year: 15,
    yearTotal: 180,
    items: ["Higher daily limits", "Longer threads", "Priority when busy"],
  },
  {
    name: "Pro",
    tag: "Recommended",
    month: 39,
    year: 31,
    yearTotal: 372,
    items: ["Much higher limits", "Saved workspaces", "Faster model lane"],
  },
  {
    name: "Max",
    tag: "Power",
    month: 99,
    year: 79,
    yearTotal: 948,
    items: ["Highest limits", "Team seats later", "Priority support"],
  },
];

export default function PlansPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="text-sm tracking-[0.14em]">
          Astral
        </Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          Back to chat
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10">
        <div className="rounded-2xl border border-violet-300/25 bg-violet-400/10 px-4 py-3 text-sm text-violet-100">
          Paid memberships are coming soon. Chat stays free. Payment will open on this page.
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-white/40">Membership</p>
            <h1 className="mt-1 text-4xl font-light tracking-tight">Choose your plan</h1>
          </div>
          <div className="inline-flex rounded-full border border-white/15 p-1 text-sm">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`cursor-pointer rounded-full px-4 py-1.5 ${annual ? "text-white/50" : "bg-white text-black"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`cursor-pointer rounded-full px-4 py-1.5 ${annual ? "bg-white text-black" : "text-white/50"}`}
            >
              Annually
              <span className="ml-2 text-[11px] text-violet-300">Save</span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <article className="flex flex-col rounded-3xl border border-white/25 bg-white/[0.04] p-6">
            <p className="text-[11px] tracking-[0.18em] text-white/40">NOW</p>
            <h2 className="mt-3 text-2xl font-light">Free</h2>
            <p className="mt-1 text-sm text-white/45">Open chat</p>
            <p className="mt-6 text-4xl font-light">$0</p>
            <p className="mt-1 text-sm text-white/35">/ month</p>
            <ul className="mt-6 space-y-2 text-sm text-white/65">
              <li>Ask anything</li>
              <li>General models</li>
              <li>Explore the story</li>
            </ul>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm text-black"
            >
              Current plan
            </Link>
          </article>

          {paid.map((p) => (
            <article key={p.name} className="relative flex flex-col rounded-3xl border border-white/10 p-6 opacity-80">
              <p className="text-[11px] tracking-[0.18em] text-white/40">{p.tag.toUpperCase()}</p>
              <h2 className="mt-3 text-2xl font-light">{p.name}</h2>
              <p className="mt-1 text-sm text-white/45">Coming soon</p>
              <p className="mt-6 text-4xl font-light">${annual ? p.year : p.month}</p>
              <p className="mt-1 text-sm text-white/35">
                / month
                {annual ? <span className="ml-2 line-through">${p.month}</span> : null}
              </p>
              {annual ? <p className="mt-1 text-xs text-white/30">Billed ${p.yearTotal} a year</p> : null}
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                {p.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-8 inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-white/15 px-4 text-sm text-white/40"
              >
                Coming soon
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

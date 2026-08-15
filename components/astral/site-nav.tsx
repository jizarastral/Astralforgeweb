"use client";

import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { SITE } from "@/lib/astral-content";

const links = [
  { href: "#about", label: "About" },
  { href: "#modes", label: "Modes" },
  { href: "#path", label: "Path" },
  { href: "#forge", label: "Forge" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-wide">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="gold-gradient">ASTRAL</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href={SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 px-4 py-1.5 font-medium text-black transition hover:opacity-90"
          >
            Website
          </a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-background/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

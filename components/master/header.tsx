"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#chat", label: "Chat" },
  { href: "/what-we-do", label: "Forge" },
  { href: "/contact", label: "Contact" },
];

export function MasterHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  if (path === "/" || path === "/plans") return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#0b0b0c]/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm tracking-[0.14em] text-white/80 transition-colors duration-200 hover:text-white"
        >
          Astral
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/50 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0b0b0c]/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-white/70 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

    </header>
  );
}

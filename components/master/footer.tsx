import Link from "next/link";

export function MasterFooter() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-story)] text-xl text-white">
            Astral
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Cinematic AI chat, image generation, lead capture, and business automation systems for modern companies.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/#chat" className="hover:text-foreground">Chat</Link>
            </li>
            <li>
              <Link href="/#hole" className="hover:text-foreground">The rabbit hole</Link>
            </li>
            <li>
              <Link href="/what-we-do" className="hover:text-foreground">Forge</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
            Direct
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="hover:text-foreground">Request a build</Link>
            </li>
            <li>Azure OpenAI — local, unpublished</li>
            <li>Video generation planned as premium module</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/5 py-6 text-center text-[11px] tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} Astral Forge AI · Built locally first
      </p>
    </footer>
  );
}
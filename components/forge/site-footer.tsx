import Link from "next/link";
import { FORGE } from "@/lib/forge-services";
import { SHOP_HOME } from "@/lib/shopify";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg gold-gradient">
            {FORGE.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{FORGE.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Products
          </Link>
          <Link href="/what-we-do" className="hover:text-foreground">
            What we do
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <a
            href={SHOP_HOME}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Shopify
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {FORGE.name} · UAE
      </p>
    </footer>
  );
}

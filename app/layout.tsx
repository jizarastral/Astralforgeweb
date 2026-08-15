import type { Metadata } from "next";
import { Cinzel, Manrope, Newsreader } from "next/font/google";
import { MasterHeader } from "@/components/master/header";
import { MasterFooter } from "@/components/master/footer";
import { Starfield } from "@/components/master/starfield";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
});

const story = Newsreader({
  subsets: ["latin"],
  variable: "--font-story",
  weight: ["300", "400", "500"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Astral Forge AI — Business AI Systems",
    template: "%s · AstralForge AE",
  },
  description:
    "A simple AI chat on the surface. Azure and the business system sit underneath.",
  metadataBase: new URL("https://astralforgeae.com"),
  openGraph: {
    title: "Astral Forge AI — Business AI Systems",
    description:
      "AI chat, image generation, and business automation under Astral Forge AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${story.variable} ${body.variable} font-[family-name:var(--font-body)]`}
      >
        <Starfield />
        <MasterHeader />
        <main className="relative min-h-screen">{children}</main>
        <MasterFooter />
      </body>
    </html>
  );
}

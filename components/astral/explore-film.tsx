"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FILM = "/astral/flow/explore.mp4";

export function ExploreFilm({ onClose }: { onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const node = video.current;
    if (node) {
      node.currentTime = 0;
      void node.play().catch(() => {});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black" role="dialog" aria-label="Astral Forge film">
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={FILM}
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => setEnded(true)}
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 min-h-11 cursor-pointer rounded-full border border-white/25 px-4 text-xs tracking-[0.18em] text-white/80 transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Close
      </button>

      {ended ? (
        <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Back to chat
          </button>
          <Link
            href="/contact"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/30 px-5 py-2.5 text-sm text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Request a build
          </Link>
        </div>
      ) : null}
    </div>
  );
}

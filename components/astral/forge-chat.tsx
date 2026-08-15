"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { TwinkleStars } from "@/components/astral/twinkle-stars";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ForgeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("local");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [falling, setFalling] = useState(false);
  const [star, setStar] = useState<{ x: number; y: number; trails: Array<{ x: number; y: number }> } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/azure/status")
      .then((r) => r.json())
      .then((d: { mode?: string; label?: string }) => setMode(d.label || d.mode || "local"))
      .catch(() => setMode("local"));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = unlocked ? "" : "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [unlocked]);

  function explore() {
    if (falling || unlocked) return;
    setFalling(true);
    setUnlocked(true);

    const html = document.documentElement;
    const prevSmooth = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.58;
    const endY = window.innerHeight + 48;
    const startScroll = window.scrollY;
    const hole = document.getElementById("hole");
    const endScroll = hole
      ? hole.getBoundingClientRect().top + window.scrollY
      : startScroll + window.innerHeight;
    const duration = 2200;
    const t0 = performance.now();
    const trails: Array<{ x: number; y: number }> = [];

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const ease = t * t * (1.2 - 0.2 * t);
      const y = startY + (endY - startY) * ease;
      const x = startX + Math.sin(t * Math.PI) * 18;
      trails.unshift({ x, y });
      if (trails.length > 10) trails.pop();
      setStar({ x, y, trails: [...trails] });
      window.scrollTo(0, startScroll + (endScroll - startScroll) * ease);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setStar(null);
        html.style.scrollBehavior = prevSmooth;
      }
    };
    requestAnimationFrame(tick);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");
    setMessages((cur) => [...cur, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Chat is unavailable right now.");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as { text?: string; mode?: string };
            if (json.mode) setMode(json.mode);
            if (json.text) {
              assembled += json.text;
              const snapshot = assembled;
              setMessages((cur) => {
                const copy = [...cur];
                copy[copy.length - 1] = { role: "assistant", content: snapshot };
                return copy;
              });
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed.");
      setMessages((cur) => {
        const copy = [...cur];
        if (copy[copy.length - 1]?.role === "assistant" && !copy[copy.length - 1].content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setBusy(false);
      field.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  const empty = messages.length === 0;

  return (
    <section
      id="chat"
      className="relative flex h-[100svh] max-h-[100svh] items-center justify-center overflow-hidden bg-[#07070b] px-5 pt-16"
    >
      <TwinkleStars />

      {star ? (
        <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
          {star.trails.map((p, i) => (
            <span
              key={i}
              className="absolute block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-200"
              style={{
                left: p.x,
                top: p.y,
                opacity: Math.max(0, 0.35 - i * 0.03),
                transform: `translate(-50%, -50%) scale(${1 - i * 0.07})`,
                boxShadow: "0 0 10px rgba(196,181,253,0.55)",
              }}
            />
          ))}
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: star.x, top: star.y }}
          >
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
              <path
                d="M32 4 L38 24 L58 24 L42 36 L48 56 L32 44 L16 56 L22 36 L6 24 L26 24 Z"
                stroke="#ddd6fe"
                strokeWidth="2.2"
                fill="rgba(196,181,253,0.45)"
              />
            </svg>
          </span>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-[640px] flex-col items-center">
        {empty ? (
          <div className="mb-8 text-center">
            <h1 className="font-[family-name:var(--font-story)] text-5xl font-light tracking-tight text-white md:text-6xl">
              Astral
            </h1>
            <p className="mt-3 text-base text-white/50">Ask anything.</p>
          </div>
        ) : (
          <div ref={scroller} className="mb-6 max-h-[36vh] w-full space-y-5 overflow-y-auto">
            {messages.map((m, i) => (
              <article
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] whitespace-pre-wrap text-[15px] leading-7 ${
                    m.role === "user"
                      ? "rounded-3xl bg-white/[0.08] px-4 py-3 text-white"
                      : "text-white/80"
                  }`}
                >
                  {m.role === "assistant" && !m.content && busy ? (
                    <span className="inline-flex items-center gap-2 text-white/40">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking
                    </span>
                  ) : (
                    m.content
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="relative w-full">
          <label htmlFor="astral-input" className="sr-only">
            Message Astral
          </label>
          <textarea
            id="astral-input"
            ref={field}
            rows={1}
            value={input}
            disabled={busy}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Message Astral"
            className="min-h-14 w-full resize-none rounded-full border border-white/20 bg-white/[0.05] py-4 pl-6 pr-14 text-base text-white outline-none placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-opacity duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </form>

        <button
          type="button"
          onClick={explore}
          className="mt-7 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/30 px-8 py-2 text-sm tracking-[0.18em] text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Explore
        </button>
        <p className="mt-4 text-center text-[11px] text-white/28">{error || mode}</p>
      </div>
    </section>
  );
}

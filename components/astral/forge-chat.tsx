"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ProviderInfo = { id: string; label: string; ready: boolean };

const ALL_MODELS: ProviderInfo[] = [
  { id: "azure", label: "Azure", ready: false },
  { id: "nvidia", label: "NVIDIA", ready: false },
  { id: "xai", label: "xAI", ready: false },
  { id: "anthropic", label: "Claude", ready: false },
  { id: "openai", label: "GPT", ready: false },
  { id: "gemini", label: "Gemini", ready: false },
  { id: "groq", label: "Groq", ready: false },
  { id: "openrouter", label: "OpenRouter", ready: false },
];

export function ForgeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("local");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [falling, setFalling] = useState(false);
  const [providers, setProviders] = useState(ALL_MODELS);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/azure/status")
      .then((r) => r.json())
      .then((d: { mode?: string; label?: string; providers?: ProviderInfo[] }) => {
        setMode(d.label || d.mode || "local");
        if (Array.isArray(d.providers)) {
          const map = new Map(d.providers.map((p) => [p.id, p.ready]));
          setProviders(
            ALL_MODELS.map((p) => ({ ...p, ready: Boolean(map.get(p.id)) })),
          );
        }
      })
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
    window.setTimeout(() => {
      setUnlocked(true);
      document.getElementById("hole")?.scrollIntoView({ behavior: "smooth" });
    }, 1100);
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
      className="relative flex h-[100svh] max-h-[100svh] overflow-hidden bg-[#07070f] px-4 pt-20 pb-6 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(124,58,237,0.18),transparent_42%),radial-gradient(ellipse_at_80%_80%,rgba(56,189,248,0.08),transparent_40%)]" />
        <div className="absolute -left-20 top-16 h-72 w-72 animate-[smoke-drift_18s_ease-in-out_infinite] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 animate-[smoke-drift_22s_ease-in-out_infinite_reverse] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-[30rem] animate-[smoke-drift_26s_ease-in-out_infinite] rounded-full bg-white/5 blur-3xl" />
      </div>

      {falling ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[46%] z-30 -translate-x-1/2 animate-[star-fall_1.1s_ease-in_forwards]"
        >
          <StarMark />
        </span>
      ) : null}

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl gap-5 md:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-[#0b0b14]/80 p-5 backdrop-blur-xl md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <StarMark />
            <div>
              <p className="text-sm tracking-[0.22em] text-white">ASTRAL FORGE</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                AI conversation engine
              </p>
            </div>
          </div>

          {empty ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <h1 className="max-w-xl font-[family-name:var(--font-story)] text-4xl font-light text-white md:text-5xl">
                What are you looking for?
              </h1>
              <button
                type="button"
                onClick={explore}
                className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-violet-300/50 bg-violet-500/10 px-7 py-2.5 text-sm tracking-[0.2em] text-white transition-colors duration-200 hover:bg-violet-400/20 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                Explore
                <StarMark />
              </button>
            </div>
          ) : (
            <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <article
                  key={`${m.role}-${i}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap text-[15px] leading-7 ${
                      m.role === "user"
                        ? "rounded-2xl bg-white/[0.08] px-4 py-3 text-white"
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

          <form onSubmit={onSubmit} className="relative mt-5">
            <label htmlFor="astral-input" className="sr-only">
              Compose your message
            </label>
            <textarea
              id="astral-input"
              ref={field}
              rows={1}
              value={input}
              disabled={busy}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Compose your message..."
              className="min-h-14 w-full resize-none rounded-2xl border border-white/12 bg-black/30 py-4 pl-5 pr-14 text-base text-white outline-none placeholder:text-white/35 focus:border-violet-300/50 focus:ring-2 focus:ring-violet-300/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="absolute bottom-2 right-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-violet-400 text-black transition-opacity duration-200 hover:bg-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-3 text-[11px] text-white/30">{error || mode}</p>
        </div>

        <aside className="hidden rounded-3xl border border-white/10 bg-[#0b0b14]/80 p-5 backdrop-blur-xl md:block">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-white/45">
            Model nexus
          </p>
          <ul className="space-y-2">
            {providers.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3"
              >
                <span className="text-sm text-white/80">{p.label}</span>
                <span
                  className={`h-2 w-2 rounded-full ${p.ready ? "bg-emerald-400" : "bg-white/20"}`}
                  aria-label={p.ready ? "ready" : "offline"}
                />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function StarMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 4 L38 24 L58 24 L42 36 L48 56 L32 44 L16 56 L22 36 L6 24 L26 24 Z"
        stroke="#c4b5fd"
        strokeWidth="2.2"
        fill="rgba(167,139,250,0.25)"
      />
    </svg>
  );
}

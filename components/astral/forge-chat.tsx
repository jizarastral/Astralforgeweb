"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Loader2 } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const starters = [
  "Teach me something new",
  "Help me write this",
  "Debug this code",
  "Make a simple plan",
];

export function ForgeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/azure/status")
      .then((r) => r.json())
      .then((d: { label?: string; mode?: string; configured?: boolean }) => {
        if (!d.configured) {
          setMode("");
          return;
        }
        const name = d.label || d.mode || "";
        setMode(name === "local" || name === "Local preview" ? "" : name);
      })
      .catch(() => setMode(""));
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
    document.documentElement.style.overflow = "";
    setUnlocked(true);
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
            if (json.mode && json.mode !== "local") setMode(json.mode);
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
    <section id="chat" className="relative flex h-[100svh] max-h-[100svh] flex-col bg-[#0a0a0b]">
      <header className="flex h-14 shrink-0 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <span className="text-sm tracking-[0.14em] text-white">Astral</span>
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/45">
            Free
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-white/50">
          <button
            type="button"
            onClick={explore}
            className="cursor-pointer transition-colors duration-200 hover:text-white"
          >
            Explore
          </button>
          <Link href="/plans" className="transition-colors duration-200 hover:text-white">
            Plans
          </Link>
        </div>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-center text-3xl font-normal tracking-tight text-white md:text-4xl">
              What can I help with?
            </h1>
            <div className="mt-8 flex w-full max-w-[680px] flex-wrap justify-center gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[680px] space-y-6 py-8">
            {messages.map((m, i) => (
              <article
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] whitespace-pre-wrap text-[15px] leading-7 ${
                    m.role === "user"
                      ? "rounded-3xl bg-white/[0.08] px-4 py-3 text-white"
                      : "text-white/85"
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
      </div>

      <div className="shrink-0 px-4 pb-5 pt-2">
        <form onSubmit={onSubmit} className="relative mx-auto w-full max-w-[680px]">
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
            className="h-14 w-full resize-none rounded-3xl border border-white/15 bg-white/[0.05] py-4 pl-5 pr-14 text-base text-white outline-none placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-white/15 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="absolute top-1.5 right-1.5 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-opacity duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </form>
        <p className="mx-auto mt-3 max-w-[680px] text-center text-[11px] text-white/28">
          {error || mode || "Free plan · Paid plans next"}
        </p>
      </div>
    </section>
  );
}

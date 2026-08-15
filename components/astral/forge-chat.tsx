"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Loader2, Menu, PanelLeft, Plus, Trash2, X } from "lucide-react";
import {
  emptyThread,
  loadThreads,
  saveThreads,
  titleFrom,
  type ChatThread,
} from "@/lib/chat-threads";

type ChatMessage = { role: "user" | "assistant"; content: string };

const starters = [
  "Teach me something new",
  "Help me write this",
  "Debug this code",
  "Make a simple plan",
];

export function ForgeChat() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [rail, setRail] = useState(true);
  const [ready, setReady] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = loadThreads();
    if (stored.length) {
      setThreads(stored);
      setActiveId(stored[0].id);
    } else {
      const first = emptyThread();
      setThreads([first]);
      setActiveId(first.id);
    }
    setReady(true);
    setRail(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (ready) saveThreads(threads);
  }, [threads, ready]);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  const messages = active?.messages ?? [];

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

  function patchActive(next: ChatMessage[]) {
    setThreads((cur) =>
      cur.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: next,
              title: t.messages.length === 0 && next[0] ? titleFrom(next[0].content) : t.title,
              updatedAt: Date.now(),
            }
          : t,
      ),
    );
  }

  function newChat() {
    const thread = emptyThread();
    setThreads((cur) => [thread, ...cur]);
    setActiveId(thread.id);
    setInput("");
    setError("");
    if (window.innerWidth < 768) setRail(false);
  }

  function removeChat(id: string) {
    setThreads((cur) => {
      const next = cur.filter((t) => t.id !== id);
      const fallback = next[0] ?? emptyThread();
      const list = next.length ? next : [fallback];
      if (id === activeId) setActiveId(list[0].id);
      return list;
    });
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || !active) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    patchActive(next);
    setInput("");
    setBusy(true);
    setError("");
    const withBlank: ChatMessage[] = [...next, { role: "assistant", content: "" }];
    patchActive(withBlank);

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
              setThreads((cur) =>
                cur.map((t) =>
                  t.id === activeId
                    ? {
                        ...t,
                        messages: t.messages.map((m, i) =>
                          i === t.messages.length - 1 ? { ...m, content: snapshot } : m,
                        ),
                        updatedAt: Date.now(),
                      }
                    : t,
                ),
              );
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed.");
      setThreads((cur) =>
        cur.map((t) =>
          t.id === activeId
            ? {
                ...t,
                messages: t.messages.filter((m, i) => !(i === t.messages.length - 1 && m.role === "assistant" && !m.content)),
              }
            : t,
        ),
      );
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
    <section id="chat" className="relative flex h-[100svh] max-h-[100svh] bg-[#0a0a0b]">
      {rail ? (
        <aside className="absolute inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-white/10 bg-[#111113] md:static">
          <div className="flex items-center justify-between px-3 pt-3">
            <span className="px-1 text-sm tracking-[0.14em] text-white">Astral</span>
            <button
              type="button"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setRail(false)}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={newChat}
            className="mx-3 mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-white/80 transition-colors duration-200 hover:bg-white/5"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
          <div className="mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2">
            {threads.map((t) => (
              <div
                key={t.id}
                className={`group flex items-center rounded-lg ${
                  t.id === activeId ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(t.id);
                    if (window.innerWidth < 768) setRail(false);
                  }}
                  className="min-w-0 flex-1 cursor-pointer truncate px-3 py-2 text-left text-sm text-white/75"
                >
                  {t.title}
                </button>
                <button
                  type="button"
                  onClick={() => removeChat(t.id)}
                  className="mr-1 hidden h-8 w-8 cursor-pointer items-center justify-center text-white/30 hover:text-white group-hover:inline-flex"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={explore}
              className="flex w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              Explore
            </button>
            <Link
              href="/plans"
              className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              <span>Plans</span>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/40">
                Free
              </span>
            </Link>
          </div>
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between px-3 md:px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRail((v) => !v)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white/60 hover:bg-white/5 hover:text-white"
              aria-label="Toggle sidebar"
            >
              {rail ? <PanelLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <span className="text-sm text-white/70">{active?.title || "Astral"}</span>
          </div>
          <Link
            href="/plans"
            className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/50 transition-colors duration-200 hover:text-white"
          >
            Free
          </Link>
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
            {error || mode || "Free plan · Paid plans coming soon"}
          </p>
        </div>
      </div>
    </section>
  );
}

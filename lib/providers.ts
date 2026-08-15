import { azureChatUrl, azureConfig, isAzureConfigured } from "@/lib/azure";
import { FORGE_SYSTEM_PROMPT } from "@/lib/forge-brain";
import type { ChatMessage } from "@/lib/azure";

export type ProviderId =
  | "azure"
  | "nvidia"
  | "xai"
  | "anthropic"
  | "openrouter"
  | "groq"
  | "openai"
  | "gemini"
  | "ollama"
  | "local";

export type ProviderInfo = {
  id: ProviderId;
  label: string;
  ready: boolean;
};

function env(name: string) {
  return (process.env[name] || "").trim();
}

function sse(text: string) {
  return `data: ${JSON.stringify({ text })}\n\n`;
}

export function listProviders(): ProviderInfo[] {
  return [
    { id: "azure", label: "Azure", ready: isAzureConfigured() },
    { id: "nvidia", label: "NVIDIA", ready: Boolean(env("NVIDIA_API_KEY")) },
    { id: "xai", label: "xAI", ready: Boolean(env("XAI_API_KEY")) },
    { id: "anthropic", label: "Anthropic", ready: Boolean(env("ANTHROPIC_API_KEY")) },
    {
      id: "openrouter",
      label: "OpenRouter",
      ready: Boolean(env("OPENROUTER_API_KEY")),
    },
    { id: "groq", label: "Groq", ready: Boolean(env("GROQ_API_KEY")) },
    { id: "openai", label: "OpenAI", ready: Boolean(env("OPENAI_API_KEY")) },
    {
      id: "gemini",
      label: "Gemini",
      ready: Boolean(env("GEMINI_API_KEY") || env("GOOGLE_API_KEY")),
    },
    { id: "ollama", label: "Ollama", ready: Boolean(env("OLLAMA_BASE")) },
  ];
}

export function publicProviderStatus() {
  const providers = listProviders();
  const first = providers.find((p) => p.ready);
  return {
    configured: Boolean(first),
    mode: first?.id || "astral",
    label: first?.label || "Astral",
    ready: providers.filter((p) => p.ready).map((p) => p.id),
    providers,
  };
}

async function readError(res: Response) {
  const detail = await res.text().catch(() => "");
  return `${res.status} ${detail.slice(0, 220) || res.statusText}`;
}

async function streamOpenAICompat(opts: {
  id: ProviderId;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}) {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: JSON.stringify(opts.body),
  });
  if (!res.ok || !res.body) {
    throw new Error(`${opts.id} ${await readError(res)}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = res.body.getReader();

  return new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ mode: opts.id })}\n\n`),
      );
      let buffer = "";
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
          if (!payload) continue;
          if (payload === "[DONE]") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(payload) as {
              choices?: Array<{
                delta?: { content?: string };
                message?: { content?: string };
              }>;
            };
            const piece =
              json.choices?.[0]?.delta?.content ||
              json.choices?.[0]?.message?.content;
            if (piece) controller.enqueue(encoder.encode(sse(piece)));
          } catch {
            // ignore keep-alives
          }
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });
}

async function streamAnthropic(messages: ChatMessage[]) {
  const key = env("ANTHROPIC_API_KEY");
  const model = env("ANTHROPIC_MODEL") || "claude-sonnet-4-20250514";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 900,
      stream: true,
      system: FORGE_SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`anthropic ${await readError(res)}`);
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ mode: "anthropic" })}\n\n`),
      );
      let buffer = "";
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
            const json = JSON.parse(payload) as {
              type?: string;
              delta?: { text?: string };
            };
            if (json.type === "content_block_delta" && json.delta?.text) {
              controller.enqueue(encoder.encode(sse(json.delta.text)));
            }
          } catch {
            // ignore
          }
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });
}

async function tryProvider(id: ProviderId, messages: ChatMessage[]) {
  const packed = [{ role: "system", content: FORGE_SYSTEM_PROMPT }, ...messages];

  if (id === "azure") {
    const { apiKey } = azureConfig();
    return streamOpenAICompat({
      id,
      url: azureChatUrl(),
      headers: { "api-key": apiKey },
      body: {
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "nvidia") {
    return streamOpenAICompat({
      id,
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      headers: { Authorization: `Bearer ${env("NVIDIA_API_KEY")}` },
      body: {
        model: env("NVIDIA_MODEL") || "meta/llama-3.1-8b-instruct",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "xai") {
    return streamOpenAICompat({
      id,
      url: "https://api.x.ai/v1/chat/completions",
      headers: { Authorization: `Bearer ${env("XAI_API_KEY")}` },
      body: {
        model: env("XAI_MODEL") || "grok-4.5",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "openrouter") {
    return streamOpenAICompat({
      id,
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        Authorization: `Bearer ${env("OPENROUTER_API_KEY")}`,
        "HTTP-Referer": "https://astralforge.ae",
        "X-Title": "Astral",
      },
      body: {
        model: env("OPENROUTER_MODEL") || "openai/gpt-4o-mini",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "groq") {
    return streamOpenAICompat({
      id,
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}` },
      body: {
        model: env("GROQ_MODEL") || "llama-3.3-70b-versatile",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "openai") {
    return streamOpenAICompat({
      id,
      url: "https://api.openai.com/v1/chat/completions",
      headers: { Authorization: `Bearer ${env("OPENAI_API_KEY")}` },
      body: {
        model: env("OPENAI_MODEL") || "gpt-4o-mini",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "gemini") {
    const key = env("GEMINI_API_KEY") || env("GOOGLE_API_KEY");
    return streamOpenAICompat({
      id,
      url: `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      headers: { Authorization: `Bearer ${key}` },
      body: {
        model: env("GEMINI_MODEL") || "gemini-2.0-flash",
        messages: packed,
        temperature: 0.6,
        stream: true,
        max_tokens: 900,
      },
    });
  }

  if (id === "ollama") {
    const base = (env("OLLAMA_BASE") || "http://127.0.0.1:11434").replace(/\/+$/, "");
    return streamOpenAICompat({
      id,
      url: `${base}/v1/chat/completions`,
      headers: {},
      body: {
        model: env("OLLAMA_MODEL") || "llama3",
        messages: packed,
        temperature: 0.6,
        stream: true,
      },
    });
  }

  if (id === "anthropic") {
    return streamAnthropic(messages);
  }

  throw new Error(`${id} is not configured`);
}

export async function streamWithFallback(messages: ChatMessage[]) {
  const order: ProviderId[] = [
    "azure",
    "nvidia",
    "xai",
    "anthropic",
    "openrouter",
    "groq",
    "openai",
    "gemini",
    "ollama",
  ];
  const ready = new Set(listProviders().filter((p) => p.ready).map((p) => p.id));
  const errors: string[] = [];

  for (const id of order) {
    if (!ready.has(id)) continue;
    try {
      return await tryProvider(id, messages);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(errors[0] || "No live model key is set");
}

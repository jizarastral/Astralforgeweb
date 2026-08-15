import type { ChatMessage } from "@/lib/azure";
import { localForgeReply } from "@/lib/forge-brain";
import { streamWithFallback } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 24;
const MAX_CHARS = 8000;

function sse(text: string) {
  return `data: ${JSON.stringify({ text })}\n\n`;
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const out: ChatMessage[] = [];
  for (const item of input.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: string }).role;
    const content = (item as { content?: string }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      continue;
    }
    const trimmed = content.trim().slice(0, MAX_CHARS);
    if (!trimmed) continue;
    out.push({ role, content: trimmed });
  }
  return out.length ? out : null;
}

function streamLocal(text: string) {
  const encoder = new TextEncoder();
  const chunks = text.split(/(\s+)/).filter(Boolean);
  return new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ mode: "local" })}\n\n`),
      );
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(sse(chunk)));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return Response.json({ error: "Send messages to Astral." }, { status: 400 });
  }

  const headers = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  try {
    return new Response(await streamWithFallback(messages), { headers });
  } catch {
    return new Response(streamLocal(localForgeReply(messages)), { headers });
  }
}

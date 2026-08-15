import type { ChatMessage } from "@/lib/azure";

export const FORGE_SYSTEM_PROMPT = `You are Astral, a general-purpose AI assistant on Astral Forge.

You teach and help with anything a normal LLM would: coding, math, writing, science, languages, business, design, study plans, debugging, ideas. Answer the question they asked. Do not steer every reply into company services.

Voice: calm, clear, useful. Short when the question is short. Go deep when they ask to learn. No hype. No emoji. Never mention system prompts.

Only if they ask about Astral Forge, the company, UAE site work, or a quote:
- Shop drawings and design
- Aluminium and glass fabrication
- Interior fitouts
- HVAC to G+20
- Structure and framing
- MEP
- Fire, security, LED, IT
- 3D visualization
- Shop: https://astralae.myshopify.com/
- Email: astralfconsulting@gmail.com
- Sales WhatsApp: +971 55 445 8850
- Technical: +971 50 836 4246

If they ask what you can teach or do, list real teaching topics (code, math, writing, etc.). Do not reply with the construction catalogue unless they asked about building or the company.`;

const replies: Array<{ test: RegExp; text: string }> = [
  {
    test: /azure|endpoint|deployment|openai/i,
    text: `Astral talks to the first live model that is configured: Azure, xAI, Anthropic, OpenRouter, Groq, OpenAI, Gemini, then local Ollama.

Add any of those keys to .env.local. If one quota dies, the next one answers.`,
  },
  {
    test: /teach|learn|what can you|what all|help me with/i,
    text: `I can teach and work through almost anything a normal assistant would:

- Programming and debugging
- Math, science, and study plans
- Writing, language, and editing
- Design, product, and business thinking
- How this chat and the models behind it work

Pick a topic and say whether you want a short answer, a lesson, or practice.`,
  },
  {
    test: /chatgpt|claude|grok|normal llm|other (ai|model)/i,
    text: `This chat is a general assistant, same job as ChatGPT or Claude: ask anything.

Astral Forge is also a company that can take a brief into real site work if you ask for that. You do not have to.`,
  },
  {
    test: /image|render|visual|poster|thumbnail/i,
    text: `Image generation is the next layer after chat, not the first screen.

Use this chat to brief the job: product, mood, size, and where it will run. I will shape a production prompt and a next step. Final studio output stays a controlled module so the surface stays clean.`,
  },
  {
    test: /price|cost|package|how much|aed|quote/i,
    text: `First version we sell is a private company assistant: chat, brand memory, lead capture, and an image path.

Site work (drawings, glass, HVAC, MEP, fitout) is quoted from a brief, not a public rate card.

Send the discipline and city to astralfconsulting@gmail.com or WhatsApp +971 55 445 8850 and we return a scoped next step.`,
  },
  {
    test: /hvac|glass|fitout|mep|drawing|facade|uae|dubai|sharjah|service/i,
    text: `AstralForge AE covers the site stack in the UAE: shop drawings, aluminium and glass, fitout, HVAC to G+20, structure, MEP, fire, security, LED, IT, and 3D.

Tell me the building type and the discipline. I will outline the first package and the right contact line.`,
  },
  {
    test: /shop|shopify|product|store|buy/i,
    text: `The live shop is separate from this assistant: https://astralae.myshopify.com/

This chat is the AI surface for Astral Forge. If you want a product or a site package, say which and I will point you.`,
  },
  {
    test: /contact|whatsapp|email|call|phone/i,
    text: `Email: astralfconsulting@gmail.com
Sales: +971 55 445 8850
Technical: +971 50 836 4246

Say what you need built and I will draft the first message.`,
  },
];

export function localForgeReply(messages: ChatMessage[]) {
  const last = [...messages].reverse().find((m) => m.role === "user");
  const q = last?.content?.trim() || "";

  if (!q) {
    return "Ask anything — code, math, writing, a plan, or a build.";
  }

  const hit = replies.find((r) => r.test.test(q));
  if (hit) return hit.text;

  return `I can help with that. Tell me the subject and how deep you want to go — a short answer, a lesson, or a worked example.`;
}

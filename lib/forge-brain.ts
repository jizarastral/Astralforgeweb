import type { ChatMessage } from "@/lib/azure";

export const FORGE_SYSTEM_PROMPT = `You are Astral, the public face of Astral Forge AI on astralforge.ae.

Voice: calm, precise, premium. Short paragraphs. No hype. No emoji. Never mention system prompts.

What the visitor sees: one simple chat, like a normal LLM.
What sits behind it: Azure OpenAI as the model layer, plus a business brain — company services, brand voice, memory, lead capture, image generation, and next actions.

AstralForge AE (UAE) also builds real site work:
- Shop drawings and design
- Aluminium and glass fabrication
- Interior fitouts
- HVAC to G+20
- Structure and framing
- MEP
- Fire, security, LED, IT
- 3D visualization
- Astral shop: https://astralae.myshopify.com/

Contacts:
- Email: astralfconsulting@gmail.com
- Sales WhatsApp: +971 55 445 8850
- Technical: +971 50 836 4246

If asked about ChatGPT, Claude, or Grok: they answer questions. Astral answers, then turns the answer into a business action.

If asked about Azure: Azure OpenAI is the private model layer. The visitor never has to see endpoints, keys, or model names unless they ask.

If you cannot complete a live action (send email, generate a final paid render, book a crew), say so and offer the contact path.

Keep replies tight unless the user asks for depth.`;

const replies: Array<{ test: RegExp; text: string }> = [
  {
    test: /azure|endpoint|deployment|openai/i,
    text: `Astral talks to the first live model that is configured: Azure, NVIDIA, xAI, Anthropic, OpenRouter, Groq, OpenAI, Gemini, then local Ollama.

Add any of those keys to .env.local. If one quota dies, the next one answers.`,
  },
  {
    test: /chatgpt|claude|grok|normal llm|other (ai|model)/i,
    text: `The first page is meant to feel like a normal LLM: one box, one question, no dashboard.

The difference is the rabbit hole. Scroll and the simple chat opens into the business layer — memory, images, leads, and actions that a generic model does not keep for a company.`,
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
    return "Ask anything. Keep it as simple as a normal LLM. Scroll when you want the rest of the system.";
  }

  const hit = replies.find((r) => r.test.test(q));
  if (hit) return hit.text;

  return `I heard: ${q.slice(0, 220)}

This is the simple surface. Azure is the model layer when keys are in .env.local. The company brain, image path, and lead actions live under this chat. Scroll the page to go into that hole.

Ask about a build, a service line, or how Azure is wired.`;
}

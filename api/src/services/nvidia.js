const { config } = require("../config");

const SYSTEM_PROMPT = `You are the AstralForge LIVE AI EMPLOYEE demonstration assistant for UAE businesses.

Identity rules:
- You are an AI assistant (never pretend to be human).
- This is a DEMO for a sample home-services / multi-industry business unless the user specifies another industry.
- Label demo pricing as DEMO. Standard AC service demo price starts from AED 150.
- Do not invent real customer data, contracts, or guaranteed business results.
- Do not request passwords, card numbers, IBAN, or medical/legal professional advice.
- Prefer short, professional replies (2–5 sentences).
- When the user shares a name, phone/WhatsApp, service need, and preferred time/date, confirm you captured a DEMO lead and list: service, preferred timing, contact, status=qualified for follow-up.
- Offer human escalation: WhatsApp +971 50 580 4276 or the website form "Get Your AI Employee".
- If asked who built you: AstralForge configures AI employees for businesses; this demo may use modern cloud AI infrastructure including NVIDIA-hosted models when configured.

Goal: show how an AI employee answers, qualifies, and captures enquiries.`;

function hasNvidia() {
  return Boolean(config.nvidia.apiKey);
}

function hasAzureOpenAI() {
  return Boolean(config.azureOpenAI.endpoint && config.azureOpenAI.key);
}

async function chatNvidia(messages) {
  const url = `${config.nvidia.baseUrl}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.nvidia.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: config.nvidia.model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 400,
      stream: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NVIDIA API ${res.status}: ${body.slice(0, 400)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("NVIDIA returned empty content");
  return { text, provider: "nvidia", model: config.nvidia.model };
}

/**
 * Supports:
 * - New Foundry / OpenAI-compat: https://{resource}.openai.azure.com/openai/v1
 * - Classic deployments: https://{resource}.openai.azure.com + deployment name
 */
async function chatAzure(messages) {
  const { endpoint, key, deployment, apiVersion } = config.azureOpenAI;
  const model = deployment || "gpt-4o-mini";
  const payloadMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];
  const isV1 =
    /\/openai\/v\d+$/i.test(endpoint) ||
    endpoint.includes("/openai/v1") ||
    endpoint.endsWith("/v1");

  let url;
  let headers;
  let body;

  if (isV1) {
    // https://astralai-resource.openai.azure.com/openai/v1/chat/completions
    url = `${endpoint}/chat/completions`;
    headers = {
      "api-key": key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    };
    body = {
      model,
      messages: payloadMessages,
      temperature: 0.4,
      max_tokens: 400,
    };
  } else {
    // Classic: {endpoint}/openai/deployments/{name}/chat/completions?api-version=
    const root = endpoint.replace(/\/openai\/?$/i, "");
    url = `${root}/openai/deployments/${encodeURIComponent(model)}/chat/completions?api-version=${apiVersion}`;
    headers = {
      "api-key": key,
      "Content-Type": "application/json",
    };
    body = {
      messages: payloadMessages,
      temperature: 0.4,
      max_tokens: 400,
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Azure OpenAI ${res.status}: ${errBody.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Azure OpenAI returned empty content");
  return { text, provider: "azure_openai", model };
}

/** Offline fallback when no API keys configured */
function chatFallback(userText) {
  const t = String(userText || "").toLowerCase();
  if (/human|person|agent|manager/.test(t)) {
    return "I can connect you with the AstralForge team. WhatsApp +971 50 580 4276 or use Get Your AI Employee on the site. I'm a DEMO AI, not a human.";
  }
  if (/price|cost|how much|aed/.test(t)) {
    return "For this DEMO home-services scenario, standard AC service starts from AED 150 (DEMO). Live pricing for your business is configured from your own rate card.";
  }
  if (/book|tomorrow|available|appointment|time/.test(t)) {
    return "I can collect preferred time and contact details, then create a booking request for your team. Share a WhatsApp number and preferred window to continue this DEMO capture.";
  }
  if (/who are you|are you|bot|ai/.test(t)) {
    return "I'm the AstralForge AI employee DEMO — not a human. I show how an AI employee answers FAQs, qualifies interest, and captures leads.";
  }
  return "I'm a DEMO AI employee. Ask about services, pricing (DEMO), availability, or leave your WhatsApp so I can capture a sample lead. For a real deployment: Get Your AI Employee on this site.";
}

function detectLeadCapture(messages, reply) {
  const blob = [...messages.map((m) => m.content), reply].join(" ").toLowerCase();
  const hasPhone = /(\+971|05\d{8}|whatsapp)/i.test(blob);
  const hasService = /(ac|service|book|clean|repair|quote|enquiry|inquiry)/i.test(blob);
  const aiClaims = /captured|lead|follow-?up|qualified/i.test(reply);
  if ((hasPhone && hasService) || (hasPhone && aiClaims)) {
    return {
      service: "Service enquiry (DEMO)",
      preferredDate: "As discussed",
      contact: "See conversation",
      status: "Qualified · Ready for follow-up (DEMO)",
    };
  }
  return null;
}

async function generateReply(history, userMessage) {
  const messages = (history || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
    .slice(-12)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  messages.push({ role: "user", content: String(userMessage).slice(0, 2000) });

  const prefer = config.aiProvider || "auto";
  const errors = [];

  async function tryAzure() {
    if (!hasAzureOpenAI()) return null;
    try {
      return await chatAzure(messages);
    } catch (e) {
      errors.push(e.message);
      console.error("[azure]", e.message);
      return null;
    }
  }

  async function tryNvidia() {
    if (!hasNvidia()) return null;
    try {
      return await chatNvidia(messages);
    } catch (e) {
      errors.push(e.message);
      console.error("[nvidia]", e.message);
      return null;
    }
  }

  let result = null;
  if (prefer === "azure") {
    result = (await tryAzure()) || (await tryNvidia());
  } else if (prefer === "nvidia") {
    result = (await tryNvidia()) || (await tryAzure());
  } else {
    // auto: NVIDIA first, then Azure Foundry / OpenAI
    result = (await tryNvidia()) || (await tryAzure());
  }

  if (!result) {
    result = {
      text: chatFallback(userMessage),
      provider: "fallback",
      model: "rules",
      errors: errors.length ? errors : undefined,
    };
  }

  const capture = detectLeadCapture(messages, result.text);
  return { ...result, capture };
}

module.exports = {
  generateReply,
  hasNvidia,
  hasAzureOpenAI,
  SYSTEM_PROMPT,
};

require("dotenv").config();

function list(name, fallback = "") {
  return String(process.env[name] || fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT || 8787),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: list(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,https://astralforgeweb.onrender.com"
  ),
  publicSiteUrl: (process.env.PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  nvidia: {
    apiKey: process.env.NVIDIA_API_KEY || "",
    baseUrl: (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/$/, ""),
    model: process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct",
  },

  azureOpenAI: {
    // e.g. https://astralai-resource.openai.azure.com/openai/v1  OR resource root
    endpoint: (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/$/, ""),
    key: process.env.AZURE_OPENAI_KEY || process.env.AZURE_AI_API_KEY || "",
    // Deployment / model name (Foundry & Azure OpenAI)
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_MODEL || "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview",
    projectUrl: process.env.AZURE_AI_PROJECT_URL || "",
  },

  // auto | nvidia | azure
  aiProvider: (process.env.AI_PROVIDER || "auto").toLowerCase(),

  leadEmail: process.env.LEAD_EMAIL || "astralfconsulting@gmail.com",
  formSubmitEnable: String(process.env.FORMSUBMIT_ENABLE || "true") === "true",
  whatsappNotify: String(process.env.WHATSAPP_NOTIFY || "971505804276").replace(/\D/g, ""),
  leadWebhookUrl: process.env.LEAD_WEBHOOK_URL || "",

  stripeSecret: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripePriceStarter: process.env.STRIPE_PRICE_STARTER || "",
  stripePriceBusiness: process.env.STRIPE_PRICE_BUSINESS || "",

  adminApiKey: process.env.ADMIN_API_KEY || "",
  demoMaxTurns: Number(process.env.DEMO_MAX_TURNS_PER_SESSION || 20),
  demoRateLimit: Number(process.env.DEMO_RATE_LIMIT_PER_MIN || 30),

  packages: {
    starter: {
      id: "starter",
      name: "AstralForge Starter — AI Employee",
      setupAed: 99900, // fils for Stripe AED (minor units = fils)
      monthlyAed: 29900,
      label: "Starter",
    },
    business: {
      id: "business",
      name: "AstralForge Business — AI Employee",
      setupAed: 199900,
      monthlyAed: 49900,
      label: "Business",
    },
  },
};

module.exports = { config };

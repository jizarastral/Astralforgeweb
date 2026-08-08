const express = require("express");
const rateLimit = require("express-rate-limit");
const { config } = require("../config");
const { generateReply, hasNvidia, hasAzureOpenAI } = require("../services/nvidia");
const store = require("../services/store");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.demoRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many demo messages. Wait a minute." },
});

router.get("/status", (_req, res) => {
  res.json({
    ok: true,
    providers: {
      nvidia: hasNvidia(),
      azureOpenAI: hasAzureOpenAI(),
      fallback: !hasNvidia() && !hasAzureOpenAI(),
    },
    label: "LIVE AI EMPLOYEE · DEMO",
  });
});

router.post("/session", (_req, res) => {
  const session = store.createSession();
  res.json({ sessionId: session.id });
});

router.post("/chat", limiter, async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message || message.length > 2000) {
      return res.status(400).json({ error: "message required (max 2000 chars)" });
    }

    let sessionId = req.body?.sessionId;
    let session = sessionId ? store.getSession(sessionId) : null;
    if (!session) {
      session = store.createSession();
      sessionId = session.id;
    }

    if (session.turns >= config.demoMaxTurns) {
      return res.status(429).json({
        error: "Demo turn limit reached for this session. Start over or request a real AI employee.",
        sessionId,
      });
    }

    const history = (session.messages || []).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const result = await generateReply(history, message);

    session.messages.push({ role: "user", content: message, at: new Date().toISOString() });
    session.messages.push({
      role: "assistant",
      content: result.text,
      at: new Date().toISOString(),
      provider: result.provider,
    });
    session.turns = (session.turns || 0) + 1;
    if (result.capture) {
      session.captured = result.capture;
      store.addEvent("demo_lead_capture", {
        sessionId,
        capture: result.capture,
        provider: result.provider,
      });
    }
    store.saveSession(session);

    res.json({
      sessionId,
      reply: result.text,
      provider: result.provider,
      model: result.model,
      capture: result.capture || session.captured || null,
      turns: session.turns,
      maxTurns: config.demoMaxTurns,
      demo: true,
    });
  } catch (e) {
    console.error("[demo/chat]", e.message);
    res.status(502).json({
      error: "AI provider unavailable",
      detail: config.nodeEnv === "development" ? e.message : undefined,
      fallbackHint: "Configure NVIDIA_API_KEY or Azure OpenAI on the API.",
    });
  }
});

module.exports = router;

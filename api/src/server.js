/**
 * AstralForge sleep-mode stack:
 * Website + Live AI demo + Lead capture + History + Money flow
 * One process. One port. Deploy this folder (or monorepo root with SERVE_STATIC).
 */
const path = require("path");
const express = require("express");
const cors = require("cors");
const { config } = require("./config");
const demoRoutes = require("./routes/demo");
const leadsRoutes = require("./routes/leads");
const prospectsRoutes = require("./routes/prospects");
const historyRoutes = require("./routes/history");
const { router: checkoutRoutes, webhookHandler } = require("./routes/checkout");
const { hasNvidia, hasAzureOpenAI } = require("./services/nvidia");
const store = require("./services/store");

const app = express();
const SITE_ROOT = path.resolve(__dirname, "..", ".."); // Astralforgeweb/

app.set("trust proxy", 1);

app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (config.nodeEnv === "development" || config.corsOrigins.includes(origin)) {
        return cb(null, true);
      }
      // same-origin static served from this app
      return cb(null, true);
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  })
);

app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => {
  const money = store.moneySummary();
  res.json({
    ok: true,
    service: "astralforge-api",
    sleepMode: true,
    pipeline: [
      "website",
      "live_ai_demo",
      "lead_capture",
      "history",
      "nvidia_ai",
      "azure_ai",
      "business_prospect",
      "payment",
    ],
    ai: {
      providerPref: config.aiProvider,
      nvidia: hasNvidia(),
      azureOpenAI: hasAzureOpenAI(),
    },
    stripe: Boolean(config.stripeSecret),
    money,
    time: new Date().toISOString(),
  });
});

app.use("/api/demo", demoRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/prospects", prospectsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/history", historyRoutes);

// Admin SPA (history + money)
app.get(["/admin", "/admin/"], (_req, res) => {
  res.sendFile(path.join(SITE_ROOT, "admin.html"));
});

// Serve website from same origin (connected by default)
const serveStatic = String(process.env.SERVE_STATIC || "true") !== "false";
if (serveStatic) {
  app.use(
    express.static(SITE_ROOT, {
      extensions: ["html"],
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );
  // SPA-ish fallback for clean URLs
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(SITE_ROOT, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(config.port, () => {
  console.log(`AstralForge SLEEP MODE on :${config.port}`);
  console.log(`  Site:   http://127.0.0.1:${config.port}/`);
  console.log(`  Admin:  http://127.0.0.1:${config.port}/admin`);
  console.log(`  Health: http://127.0.0.1:${config.port}/api/health`);
  console.log(`  NVIDIA: ${hasNvidia() ? "ON" : "off"}`);
  console.log(`  Azure:  ${hasAzureOpenAI() ? "ON (needs deployment)" : "off"}`);
  console.log(`  Stripe: ${config.stripeSecret ? "ON" : "WA invoice mode"}`);
});

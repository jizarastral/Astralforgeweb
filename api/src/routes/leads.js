const express = require("express");
const rateLimit = require("express-rate-limit");
const store = require("../services/store");
const { notifyLead } = require("../services/notify");
const { config } = require("../config");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many lead submissions. Try again later." },
});

function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.admin_key;
  if (!config.adminApiKey || key !== config.adminApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/", limiter, async (req, res) => {
  try {
    const b = req.body || {};
    const name = String(b.name || "").trim();
    const email = String(b.email || "").trim();
    const phone = String(b.phone || "").trim();
    const business_name = String(b.business_name || b.businessName || "").trim();

    if (!name || !email || !phone || !business_name) {
      return res.status(400).json({
        error: "name, business_name, email, and phone are required",
      });
    }

    const lead = store.createLead({
      name,
      business_name,
      website: String(b.website || "").trim(),
      industry: String(b.industry || "").trim(),
      email,
      phone,
      message: String(b.message || "").trim(),
      monthly_enquiries: String(b.monthly_enquiries || b.monthly_inquiries || "").trim(),
      solution: String(b.solution || b.product || "").trim(),
      plan: String(b.plan || "").trim(),
      source_page: String(b.source_page || "homepage").trim(),
      page_url: String(b.page_url || "").trim(),
      utm_source: b.utm_source || "",
      utm_medium: b.utm_medium || "",
      utm_campaign: b.utm_campaign || "",
      demo_session_id: b.sessionId || b.demo_session_id || "",
      user_agent: req.headers["user-agent"] || "",
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    });

    const prospect = store.upsertProspectFromLead(lead, { stage: "new_lead" });
    const notify = await notifyLead(lead, "lead");

    res.status(201).json({
      ok: true,
      leadId: lead.id,
      prospectId: prospect.id,
      stage: prospect.stage,
      message: "Thanks — we've received your request. We'll review your business and contact you about the next step.",
      whatsappLink: notify.whatsappLink,
    });
  } catch (e) {
    console.error("[leads]", e);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

router.get("/", requireAdmin, (req, res) => {
  res.json({ leads: store.listLeads(Number(req.query.limit) || 100) });
});

module.exports = router;

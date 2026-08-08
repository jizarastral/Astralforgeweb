const express = require("express");
const store = require("../services/store");
const { config } = require("../config");

const router = express.Router();

function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.admin_key || req.query.key;
  if (!config.adminApiKey || key !== config.adminApiKey) {
    return res.status(401).json({ error: "Unauthorized — need admin key" });
  }
  next();
}

/** Full ops dashboard data */
router.get("/", requireAdmin, (req, res) => {
  res.json(store.fullHistory(Number(req.query.limit) || 150));
});

router.get("/money", requireAdmin, (_req, res) => {
  res.json(store.moneySummary());
});

router.get("/events", requireAdmin, (req, res) => {
  res.json({ events: store.listEvents(Number(req.query.limit) || 200) });
});

/** Mark payment paid (bank transfer / WhatsApp confirmed while you sleep) */
router.post("/payments/:ref/mark-paid", requireAdmin, async (req, res) => {
  const pay = store.updatePayment(req.params.ref, {
    status: "paid",
    paidAt: new Date().toISOString(),
    paidVia: req.body?.via || "manual_admin",
    note: req.body?.note || "",
  });
  if (!pay) return res.status(404).json({ error: "Payment not found" });

  if (pay.prospectId) {
    store.updateProspect(pay.prospectId, {
      stage: "paid",
      stageNote: `Payment ${pay.ref} marked paid`,
      paidAt: pay.paidAt,
    });
  }

  res.json({ ok: true, payment: pay, summary: store.moneySummary() });
});

module.exports = router;

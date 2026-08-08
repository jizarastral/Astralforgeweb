const express = require("express");
const store = require("../services/store");
const { config } = require("../config");

const router = express.Router();

const STAGES = [
  "new_lead",
  "contacted",
  "qualified",
  "proposal_sent",
  "payment_pending",
  "paid",
  "onboarding",
  "lost",
];

function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"] || req.query.admin_key;
  if (!config.adminApiKey || key !== config.adminApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.get("/", requireAdmin, (req, res) => {
  res.json({ stages: STAGES, prospects: store.listProspects(Number(req.query.limit) || 200) });
});

router.get("/:id", requireAdmin, (req, res) => {
  const p = store.getProspect(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

router.patch("/:id", requireAdmin, (req, res) => {
  const stage = req.body?.stage;
  if (stage && !STAGES.includes(stage)) {
    return res.status(400).json({ error: "Invalid stage", stages: STAGES });
  }
  const p = store.updateProspect(req.params.id, {
    stage,
    stageNote: req.body?.note || "",
    plan: req.body?.plan,
    ownerNotes: req.body?.ownerNotes,
  });
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

module.exports = router;

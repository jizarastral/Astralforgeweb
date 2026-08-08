/**
 * Persistence for AstralForge pipeline (leads, prospects, payments, event history).
 * JSON files under data/ — fine for early volume; swap to Azure Table later.
 */
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const PROSPECTS_FILE = path.join(DATA_DIR, "prospects.json");
const SESSIONS_FILE = path.join(DATA_DIR, "demo-sessions.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  for (const f of [LEADS_FILE, PROSPECTS_FILE, SESSIONS_FILE, PAYMENTS_FILE, EVENTS_FILE]) {
    if (!fs.existsSync(f)) fs.writeFileSync(f, "[]", "utf8");
  }
}

function read(file) {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

function write(file, rows) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
}

function addEvent(type, payload = {}) {
  const rows = read(EVENTS_FILE);
  const ev = {
    id: randomUUID(),
    type,
    at: new Date().toISOString(),
    ...payload,
  };
  rows.unshift(ev);
  write(EVENTS_FILE, rows.slice(0, 10000));
  return ev;
}

function listEvents(limit = 200) {
  return read(EVENTS_FILE).slice(0, limit);
}

function createLead(input) {
  const rows = read(LEADS_FILE);
  const lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new_lead",
    ...input,
  };
  rows.unshift(lead);
  write(LEADS_FILE, rows.slice(0, 5000));
  addEvent("lead_created", {
    leadId: lead.id,
    name: lead.name,
    business: lead.business_name || lead.businessName,
    email: lead.email,
    plan: lead.plan,
    money: false,
  });
  return lead;
}

function getLead(id) {
  return read(LEADS_FILE).find((r) => r.id === id) || null;
}

function listLeads(limit = 100) {
  return read(LEADS_FILE).slice(0, limit);
}

function upsertProspectFromLead(lead, extra = {}) {
  const rows = read(PROSPECTS_FILE);
  let p = rows.find((r) => r.leadId === lead.id || (lead.email && r.email === lead.email));
  if (!p) {
    p = {
      id: randomUUID(),
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      stage: "new_lead",
      history: [],
    };
    rows.unshift(p);
  }
  Object.assign(p, {
    updatedAt: new Date().toISOString(),
    name: lead.name || p.name,
    businessName: lead.business_name || lead.businessName || p.businessName,
    email: lead.email || p.email,
    phone: lead.phone || p.phone,
    industry: lead.industry || p.industry,
    solution: lead.solution || p.solution,
    plan: lead.plan || p.plan || "Business",
    website: lead.website || p.website,
    message: lead.message || p.message,
    ...extra,
  });
  write(PROSPECTS_FILE, rows.slice(0, 5000));
  addEvent("prospect_upsert", {
    prospectId: p.id,
    leadId: lead.id,
    stage: p.stage,
    plan: p.plan,
  });
  return p;
}

function updateProspect(id, patch) {
  const rows = read(PROSPECTS_FILE);
  const i = rows.findIndex((r) => r.id === id);
  if (i < 0) return null;
  const prev = rows[i].stage;
  rows[i] = {
    ...rows[i],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (patch.stage && patch.stage !== prev) {
    rows[i].history = rows[i].history || [];
    rows[i].history.push({
      at: new Date().toISOString(),
      from: prev,
      to: patch.stage,
      note: patch.stageNote || "",
    });
    addEvent("prospect_stage", {
      prospectId: id,
      from: prev,
      to: patch.stage,
      note: patch.stageNote || "",
      plan: rows[i].plan,
    });
  }
  write(PROSPECTS_FILE, rows);
  return rows[i];
}

function getProspect(id) {
  return read(PROSPECTS_FILE).find((r) => r.id === id) || null;
}

function listProspects(limit = 100) {
  return read(PROSPECTS_FILE).slice(0, limit);
}

function getSession(sessionId) {
  return read(SESSIONS_FILE).find((r) => r.id === sessionId) || null;
}

function saveSession(session) {
  const rows = read(SESSIONS_FILE);
  const i = rows.findIndex((r) => r.id === session.id);
  if (i >= 0) rows[i] = session;
  else rows.unshift(session);
  write(SESSIONS_FILE, rows.slice(0, 2000));
  return session;
}

function createSession() {
  const session = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    turns: 0,
    messages: [],
    captured: null,
  };
  addEvent("demo_session", { sessionId: session.id });
  return saveSession(session);
}

function createPayment(input) {
  const rows = read(PAYMENTS_FILE);
  const pay = {
    id: randomUUID(),
    ref: "AF-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "pending", // pending | paid | cancelled | failed
    currency: "AED",
    ...input,
  };
  rows.unshift(pay);
  write(PAYMENTS_FILE, rows.slice(0, 5000));
  addEvent("payment_created", {
    paymentId: pay.id,
    ref: pay.ref,
    amountAed: pay.amountAed,
    packageId: pay.packageId,
    prospectId: pay.prospectId,
    method: pay.method,
    status: pay.status,
    money: true,
  });
  return pay;
}

function updatePayment(idOrRef, patch) {
  const rows = read(PAYMENTS_FILE);
  const i = rows.findIndex((r) => r.id === idOrRef || r.ref === idOrRef);
  if (i < 0) return null;
  const prev = rows[i].status;
  rows[i] = { ...rows[i], ...patch, updatedAt: new Date().toISOString() };
  write(PAYMENTS_FILE, rows);
  if (patch.status && patch.status !== prev) {
    addEvent("payment_status", {
      paymentId: rows[i].id,
      ref: rows[i].ref,
      from: prev,
      to: patch.status,
      amountAed: rows[i].amountAed,
      money: true,
    });
  }
  return rows[i];
}

function getPayment(idOrRef) {
  return read(PAYMENTS_FILE).find((r) => r.id === idOrRef || r.ref === idOrRef) || null;
}

function listPayments(limit = 100) {
  return read(PAYMENTS_FILE).slice(0, limit);
}

function moneySummary() {
  const pays = read(PAYMENTS_FILE);
  const paid = pays.filter((p) => p.status === "paid");
  const pending = pays.filter((p) => p.status === "pending");
  const sum = (arr) => arr.reduce((a, p) => a + (Number(p.amountAed) || 0), 0);
  return {
    paidCount: paid.length,
    paidAed: sum(paid),
    pendingCount: pending.length,
    pendingAed: sum(pending),
    leads: read(LEADS_FILE).length,
    prospects: read(PROSPECTS_FILE).length,
  };
}

function fullHistory(limit = 100) {
  return {
    summary: moneySummary(),
    events: listEvents(limit),
    leads: listLeads(50),
    prospects: listProspects(50),
    payments: listPayments(50),
  };
}

module.exports = {
  createLead,
  getLead,
  listLeads,
  upsertProspectFromLead,
  updateProspect,
  getProspect,
  listProspects,
  getSession,
  saveSession,
  createSession,
  createPayment,
  updatePayment,
  getPayment,
  listPayments,
  addEvent,
  listEvents,
  moneySummary,
  fullHistory,
};

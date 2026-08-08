const { config } = require("../config");

async function formSubmit(fields, subject) {
  if (!config.formSubmitEnable || !config.leadEmail) return { ok: false, reason: "disabled" };
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${config.leadEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _subject: subject,
        _template: "table",
        _captcha: "false",
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

async function webhook(payload) {
  if (!config.leadWebhookUrl) return { ok: false, reason: "no_webhook" };
  try {
    const res = await fetch(config.leadWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

function waDeepLink(text) {
  const n = config.whatsappNotify;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

async function notifyLead(lead, kind = "lead") {
  const subject =
    kind === "payment"
      ? `Payment interest — ${lead.business_name || lead.businessName || lead.name || "Prospect"}`
      : `AI Employee lead — ${lead.business_name || lead.businessName || lead.name || "New"}`;

  const summary = [
    `Kind: ${kind}`,
    `ID: ${lead.id}`,
    `Name: ${lead.name || ""}`,
    `Business: ${lead.business_name || lead.businessName || ""}`,
    `Email: ${lead.email || ""}`,
    `Phone: ${lead.phone || ""}`,
    `Industry: ${lead.industry || ""}`,
    `Solution: ${lead.solution || ""}`,
    `Plan: ${lead.plan || ""}`,
    `Message: ${lead.message || ""}`,
    `Stage: ${lead.stage || lead.status || ""}`,
  ].join("\n");

  const [email, hook] = await Promise.all([
    formSubmit({ ...lead, summary }, subject),
    webhook({ event: kind, lead, at: new Date().toISOString() }),
  ]);

  return {
    email,
    webhook: hook,
    whatsappLink: waDeepLink(summary),
  };
}

module.exports = { notifyLead, waDeepLink, formSubmit, webhook };

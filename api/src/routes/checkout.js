const express = require("express");
const rateLimit = require("express-rate-limit");
const store = require("../services/store");
const { createCheckoutSession, constructWebhookEvent } = require("../services/stripePay");
const { notifyLead } = require("../services/notify");
const { config } = require("../config");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many checkout attempts." },
});

router.get("/packages", (_req, res) => {
  const pkgs = Object.values(config.packages).map((p) => ({
    id: p.id,
    label: p.label,
    name: p.name,
    setupAed: p.setupAed / 100,
    monthlyAed: p.monthlyAed / 100,
  }));
  res.json({
    currency: "AED",
    stripeEnabled: Boolean(config.stripeSecret),
    packages: pkgs,
  });
});

function ensureProspect({ packageId, email, name, businessName, phone, prospectId, leadId }) {
  if (prospectId) {
    const p = store.updateProspect(prospectId, {
      stage: "payment_pending",
      plan: packageId,
      stageNote: "Checkout started",
    });
    return { prospectId, leadId, prospect: p };
  }
  const lead = store.createLead({
    name: name || "Checkout",
    business_name: businessName || "Business",
    email: email || "unknown@example.com",
    phone: phone || "n/a",
    plan: packageId,
    solution: "payment_checkout",
    message: "Started payment",
    source_page: "checkout",
    status: "payment_pending",
  });
  const prospect = store.upsertProspectFromLead(lead, {
    stage: "payment_pending",
    plan: packageId,
  });
  return { prospectId: prospect.id, leadId: lead.id, prospect };
}

/**
 * Always creates a payment record + notifies you.
 * If Stripe is configured → Checkout URL.
 * If not → WhatsApp invoice with payment REF (money still tracked).
 */
router.post("/session", limiter, async (req, res) => {
  try {
    const packageId = String(req.body?.packageId || "").toLowerCase();
    const pkg = config.packages[packageId];
    if (!pkg) {
      return res.status(400).json({ error: "packageId must be starter or business" });
    }

    const email = String(req.body?.email || "").trim();
    const name = String(req.body?.name || "").trim();
    const businessName = String(req.body?.businessName || req.body?.business_name || "").trim();
    const phone = String(req.body?.phone || "").trim();

    const ctx = ensureProspect({
      packageId,
      email,
      name,
      businessName,
      phone,
      prospectId: req.body?.prospectId,
      leadId: req.body?.leadId,
    });

    const amountAed = pkg.setupAed / 100;
    const monthlyAed = pkg.monthlyAed / 100;

    // Stripe path
    if (config.stripeSecret) {
      try {
        const session = await createCheckoutSession({
          packageId,
          prospectId: ctx.prospectId,
          leadId: ctx.leadId,
          email,
          businessName,
        });

        const pay = store.createPayment({
          method: "stripe",
          status: "pending",
          packageId,
          amountAed,
          monthlyAed,
          prospectId: ctx.prospectId,
          leadId: ctx.leadId,
          email,
          name,
          businessName,
          stripeSessionId: session.id,
        });

        await notifyLead(
          {
            id: ctx.prospectId,
            name,
            business_name: businessName,
            email,
            plan: packageId,
            stage: "payment_pending",
            message: `Stripe checkout ${session.id} · ${pay.ref} · AED ${amountAed}`,
          },
          "payment"
        );

        return res.json({
          ok: true,
          mode: "stripe",
          checkoutUrl: session.url,
          sessionId: session.id,
          paymentRef: pay.ref,
          paymentId: pay.id,
          prospectId: ctx.prospectId,
          leadId: ctx.leadId,
          package: pkg.label,
          setupAed: amountAed,
          monthlyAed,
        });
      } catch (stripeErr) {
        console.error("[stripe session]", stripeErr.message);
        // fall through to WA invoice
      }
    }

    // WhatsApp / bank invoice path (works while you sleep — you confirm paid in admin)
    const pay = store.createPayment({
      method: "whatsapp_invoice",
      status: "pending",
      packageId,
      amountAed,
      monthlyAed,
      prospectId: ctx.prospectId,
      leadId: ctx.leadId,
      email,
      name,
      businessName,
      phone,
    });

    const waText = [
      `Hi AstralForge — I want to pay for ${pkg.label}.`,
      `Amount: AED ${amountAed} setup (monthly AED ${monthlyAed} after onboarding)`,
      `Payment REF: ${pay.ref}`,
      name ? `Name: ${name}` : "",
      businessName ? `Business: ${businessName}` : "",
      email ? `Email: ${email}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/${config.whatsappNotify}?text=${encodeURIComponent(waText)}`;

    await notifyLead(
      {
        id: ctx.prospectId,
        name,
        business_name: businessName,
        email,
        phone,
        plan: packageId,
        stage: "payment_pending",
        message: `INVOICE ${pay.ref} · AED ${amountAed} · open WA to collect`,
      },
      "payment"
    );

    res.json({
      ok: true,
      mode: "whatsapp_invoice",
      whatsappUrl,
      paymentRef: pay.ref,
      paymentId: pay.id,
      prospectId: ctx.prospectId,
      leadId: ctx.leadId,
      package: pkg.label,
      setupAed: amountAed,
      monthlyAed,
      instructions:
        "Customer pays via WhatsApp / bank. Open History admin and Mark paid when money lands — pipeline updates automatically.",
    });
  } catch (e) {
    console.error("[checkout]", e);
    res.status(500).json({ error: e.message || "Checkout failed" });
  }
});

async function webhookHandler(req, res) {
  try {
    const sig = req.headers["stripe-signature"];
    const event = await constructWebhookEvent(req.body, sig);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const prospectId = session.metadata?.prospectId;
      const packageId = session.metadata?.packageId;
      const amountAed = (session.amount_total || 0) / 100;

      if (prospectId) {
        store.updateProspect(prospectId, {
          stage: "paid",
          stageNote: `Stripe ${session.id}`,
          plan: packageId,
          stripeSessionId: session.id,
          paidAt: new Date().toISOString(),
          amountTotal: session.amount_total,
          currency: session.currency,
        });
      }

      // Match pending payment by stripe session or create paid record
      const existing = store.listPayments(200).find((p) => p.stripeSessionId === session.id);
      if (existing) {
        store.updatePayment(existing.id, {
          status: "paid",
          paidAt: new Date().toISOString(),
          paidVia: "stripe_webhook",
        });
      } else {
        store.createPayment({
          method: "stripe",
          status: "paid",
          packageId,
          amountAed,
          prospectId,
          email: session.customer_details?.email || session.customer_email,
          name: session.customer_details?.name || "",
          businessName: session.metadata?.businessName || "",
          stripeSessionId: session.id,
          paidAt: new Date().toISOString(),
          paidVia: "stripe_webhook",
        });
      }

      await notifyLead(
        {
          id: prospectId || session.id,
          name: session.customer_details?.name || "",
          email: session.customer_details?.email || session.customer_email,
          business_name: session.metadata?.businessName || "",
          plan: packageId,
          stage: "paid",
          message: `💰 PAID AED ${amountAed} via Stripe ${session.id}`,
        },
        "payment"
      );
    }

    res.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook]", e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
  }
}

module.exports = { router, webhookHandler };

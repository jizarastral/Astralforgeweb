const Stripe = require("stripe");
const { config } = require("../config");

function getStripe() {
  if (!config.stripeSecret) return null;
  return new Stripe(config.stripeSecret, { apiVersion: "2024-11-20.acacia" });
}

/**
 * Create Checkout Session for package setup fee (AED).
 * Monthly retainer is noted; charge setup now (or full custom later).
 */
async function createCheckoutSession({ packageId, prospectId, leadId, email, businessName, successPath, cancelPath }) {
  const stripe = getStripe();
  if (!stripe) {
    const err = new Error("Stripe is not configured (STRIPE_SECRET_KEY)");
    err.code = "STRIPE_NOT_CONFIGURED";
    throw err;
  }

  const pkg = config.packages[packageId];
  if (!pkg) {
    const err = new Error("Unknown package");
    err.code = "BAD_PACKAGE";
    throw err;
  }

  const successUrl = `${config.publicSiteUrl}${successPath || "/?payment=success&session_id={CHECKOUT_SESSION_ID}"}`;
  const cancelUrl = `${config.publicSiteUrl}${cancelPath || "/?payment=cancel"}`;

  const metadata = {
    packageId: pkg.id,
    prospectId: prospectId || "",
    leadId: leadId || "",
    businessName: (businessName || "").slice(0, 120),
  };

  let lineItems;
  if (packageId === "starter" && config.stripePriceStarter) {
    lineItems = [{ price: config.stripePriceStarter, quantity: 1 }];
  } else if (packageId === "business" && config.stripePriceBusiness) {
    lineItems = [{ price: config.stripePriceBusiness, quantity: 1 }];
  } else {
    lineItems = [
      {
        price_data: {
          currency: "aed",
          unit_amount: pkg.setupAed,
          product_data: {
            name: `${pkg.name} — setup`,
            description: `Setup fee. Monthly: AED ${(pkg.monthlyAed / 100).toFixed(0)} (billed separately after onboarding).`,
          },
        },
        quantity: 1,
      },
    ];
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email || undefined,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    payment_intent_data: { metadata },
  });

  return {
    id: session.id,
    url: session.url,
    package: pkg.label,
    setupAed: pkg.setupAed / 100,
    monthlyAed: pkg.monthlyAed / 100,
  };
}

async function constructWebhookEvent(rawBody, signature) {
  const stripe = getStripe();
  if (!stripe || !config.stripeWebhookSecret) {
    throw new Error("Webhook not configured");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
}

module.exports = { createCheckoutSession, constructWebhookEvent, getStripe };

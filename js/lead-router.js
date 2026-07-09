/**
 * Lead routing for AstralForgeAE
 * - Sales primary: +971 55 445 8850
 * - Support primary: +971 50 836 4246
 * - Analysis copy (always): +971 50 580 4276
 * - Email: astralfconsulting@gmail.com
 */
(function (global) {
  const LEAD_EMAIL = "astralfconsulting@gmail.com";
  const SALES_WA = "971554458850";
  const SUPPORT_WA = "971508364246";
  const ANALYSIS_WA = "971505804276";

  function waLink(number, text) {
    const n = String(number).replace(/\D/g, "");
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  }

  function primaryFor(channel) {
    return channel === "support" ? SUPPORT_WA : SALES_WA;
  }

  function labelFor(channel) {
    return channel === "support" ? "SUPPORT" : "SALES";
  }

  async function emailLead(subject, fields) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...fields,
          _subject: subject,
          _template: "table",
          _captcha: "false",
        }),
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  /**
   * @param {{ channel?: 'sales'|'support', subject: string, fields: object, waText: string }} opts
   */
  async function deliverLead(opts) {
    const channel = opts.channel === "support" ? "support" : "sales";
    const primary = primaryFor(channel);
    const label = labelFor(channel);

    const fields = {
      ...opts.fields,
      channel: label,
      routed_primary: `+${primary}`,
      routed_analysis_copy: `+${ANALYSIS_WA}`,
    };

    const emailOk = await emailLead(opts.subject, fields);

    window.open(waLink(primary, opts.waText), "_blank", "noopener,noreferrer");

    const analysisText =
      `[ANALYSIS COPY · ${label}]\n` +
      `Primary: +${primary}\n` +
      `—\n` +
      opts.waText;

    setTimeout(() => {
      window.open(waLink(ANALYSIS_WA, analysisText), "_blank", "noopener,noreferrer");
    }, 600);

    return { emailOk, primary, analysis: ANALYSIS_WA };
  }

  /** Intercept sales/support WA links and dual-open analysis copy */
  function wireDualWaLinks() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-wa-channel]");
      if (!a) return;
      const channel = a.getAttribute("data-wa-channel");
      if (channel !== "sales" && channel !== "support") return;

      const href = a.getAttribute("href") || "";
      if (!href.includes("wa.me") && !href.includes("whatsapp")) return;

      e.preventDefault();
      const primary = primaryFor(channel);
      const label = labelFor(channel);
      let text = "";
      try {
        const u = new URL(href, window.location.origin);
        text = u.searchParams.get("text") || "";
      } catch (_) {}
      if (!text) {
        text =
          channel === "support"
            ? "Hello AstralForgeAE Technical Support, I need assistance."
            : "Hello AstralForgeAE Sales, I'd like a quote.";
      }

      window.open(waLink(primary, text), "_blank", "noopener,noreferrer");
      setTimeout(() => {
        window.open(
          waLink(
            ANALYSIS_WA,
            `[ANALYSIS COPY · ${label}]\nPrimary: +${primary}\n—\n${text}`
          ),
          "_blank",
          "noopener,noreferrer"
        );
      }, 600);
    });
  }

  global.AstralLeadRouter = {
    LEAD_EMAIL,
    SALES_WA,
    SUPPORT_WA,
    ANALYSIS_WA,
    deliverLead,
    wireDualWaLinks,
    waLink,
  };
})(window);

/**
 * Lead routing for AstralForgeAE
 * - WhatsApp (all): +971 50 580 4276 (050 580 4276)
 * - Arabic language display/contact: +971 55 445 8850 (055 445 8850)
 * - All other languages display/contact: +971 50 580 4276
 * - Technical: +971 50 836 4246
 * - Email: astralfconsulting@gmail.com
 */
(function (global) {
  const LEAD_EMAIL = "astralfconsulting@gmail.com";
  /** Primary WhatsApp — always */
  const WHATSAPP = "971505804276";
  /** Arabic language contact */
  const ARABIC_PHONE = "971554458850";
  /** Default / non-Arabic languages */
  const DEFAULT_PHONE = "971505804276";
  const TECHNICAL_WA = "971508364246";

  // Back-compat aliases
  const SALES_WA = WHATSAPP;
  const CLIENT_HAPPINESS_WA = WHATSAPP;

  function isArabicLang() {
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.startsWith("ar")) return true;
    const nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    return nav.startsWith("ar");
  }

  /** Display / call number by language (not necessarily WhatsApp) */
  function contactPhone() {
    return isArabicLang() ? ARABIC_PHONE : DEFAULT_PHONE;
  }

  function formatDisplay(digits) {
    const d = String(digits).replace(/\D/g, "");
    if (d === "971554458850") return "+971 55 445 8850";
    if (d === "971505804276") return "+971 50 580 4276";
    if (d === "971508364246") return "+971 50 836 4246";
    if (d.startsWith("971") && d.length === 12) {
      return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
    }
    return "+" + d;
  }

  function waLink(number, text) {
    const n = String(number).replace(/\D/g, "");
    return `https://wa.me/${n}?text=${encodeURIComponent(text || "")}`;
  }

  function primaryFor(channel) {
    return channel === "support" || channel === "technical" ? TECHNICAL_WA : WHATSAPP;
  }

  function labelFor(channel) {
    return channel === "support" || channel === "technical" ? "TECHNICAL" : "SALES";
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

  async function deliverLead(opts) {
    const channel =
      opts.channel === "support" || opts.channel === "technical" ? "technical" : "sales";
    const primary = primaryFor(channel);
    const label = labelFor(channel);

    const fields = {
      ...opts.fields,
      channel: label,
      language: isArabicLang() ? "ar" : "other",
      contact_phone_display: formatDisplay(contactPhone()),
      routed_whatsapp: `+${primary}`,
    };

    const emailOk = await emailLead(opts.subject, fields);
    window.open(waLink(primary, opts.waText), "_blank", "noopener,noreferrer");

    return { emailOk, primary, whatsapp: WHATSAPP };
  }

  function wireDualWaLinks() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-wa-channel]");
      if (!a) return;
      const channel = a.getAttribute("data-wa-channel");
      if (channel !== "sales" && channel !== "support" && channel !== "technical") return;

      const href = a.getAttribute("href") || "";
      if (!href.includes("wa.me") && !href.includes("whatsapp")) return;

      e.preventDefault();
      const ch = channel === "support" ? "technical" : channel;
      const primary = primaryFor(ch);
      let text = "";
      try {
        const u = new URL(href, window.location.origin);
        text = u.searchParams.get("text") || "";
      } catch (_) {}
      if (!text) {
        text =
          ch === "technical"
            ? "Hello AstralForgeAE Technical Support, I need assistance."
            : "Hi AstralForge, I want to see how an AI employee could work for my business.";
      }

      window.open(waLink(primary, text), "_blank", "noopener,noreferrer");
    });
  }

  /** Apply language-aware display numbers on [data-phone-lang] nodes */
  function applyLanguagePhones() {
    const phone = contactPhone();
    const display = formatDisplay(phone);
    document.querySelectorAll("[data-phone-lang]").forEach((el) => {
      if (el.tagName === "A" && el.getAttribute("href") && el.getAttribute("href").includes("tel:")) {
        el.setAttribute("href", "tel:+" + phone);
      }
      if (el.hasAttribute("data-phone-text")) {
        el.textContent = display;
      } else if (el.querySelector("[data-phone-text]")) {
        el.querySelectorAll("[data-phone-text]").forEach((n) => {
          n.textContent = display;
        });
      }
    });
  }

  function init() {
    wireDualWaLinks();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyLanguagePhones);
    } else {
      applyLanguagePhones();
    }
  }

  init();

  global.AstralLeadRouter = {
    LEAD_EMAIL,
    WHATSAPP,
    SALES_WA,
    ARABIC_PHONE,
    DEFAULT_PHONE,
    TECHNICAL_WA,
    CLIENT_HAPPINESS_WA,
    ANALYSIS_WA: WHATSAPP,
    SUPPORT_WA: TECHNICAL_WA,
    isArabicLang,
    contactPhone,
    formatDisplay,
    deliverLead,
    wireDualWaLinks,
    applyLanguagePhones,
    waLink,
  };
})(window);

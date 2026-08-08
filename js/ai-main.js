(() => {
  "use strict";

  const DEMO_PRICE = "AED 150"; // DEMO label elsewhere

  /* ---------- Analytics ---------- */
  function track(event, props) {
    const payload = { event, ...(props || {}), ts: Date.now() };
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (_) {}
    try {
      if (typeof window.gtag === "function") window.gtag("event", event, props || {});
    } catch (_) {}
    if (location.hostname === "localhost" || location.search.includes("debug=1")) {
      console.info("[af-track]", event, props || {});
    }
  }
  window.afTrack = track;
  track("page_view", { path: location.pathname });

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    const name = el.getAttribute("data-track");
    track(name, {
      href: el.getAttribute("href") || "",
      text: (el.textContent || "").trim().slice(0, 80),
    });
    if (name.includes("pricing")) track("pricing_view", { cta: name });
    if (name.includes("whatsapp") || name.includes("_wa") || name === "fab_whatsapp") {
      track("whatsapp_clicked", { source: name });
    }
    if (name.includes("phone") || name.includes("call")) track("call_clicked", { source: name });
    if (name.includes("cta") || name.includes("primary") || name.includes("lead")) {
      track("CTA_clicked", { source: name });
    }
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (window.AstralLeadRouter && typeof window.AstralLeadRouter.wireDualWaLinks === "function") {
    window.AstralLeadRouter.wireDualWaLinks();
  }

  /* Nav */
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 60 + i * 80);
  });

  /* Product / plan deep links */
  document.querySelectorAll("[data-product]").forEach((el) => {
    el.addEventListener("click", () => {
      const p = el.getAttribute("data-product");
      const sel = document.getElementById("productSelect");
      if (p && sel) {
        const match = [...sel.options].find((o) => o.value === p || o.textContent === p);
        if (match) sel.value = match.value;
      }
    });
  });
  document.querySelectorAll("[data-plan]").forEach((el) => {
    el.addEventListener("click", () => {
      const plan = el.getAttribute("data-plan");
      const field = document.getElementById("planField");
      if (field) field.value = plan || "";
      track("pricing_plan_selected", { plan });
    });
  });

  /* ---------- ROI: missed enquiries model ---------- */
  const inq = document.getElementById("roiInquiries");
  const val = document.getElementById("roiValue");
  const missed = document.getElementById("roiMissed");
  const inqVal = document.getElementById("inqVal");
  const outValue = document.getElementById("roiMissedValue");
  const outCount = document.getElementById("roiMissedCount");

  function fmtAED(n) {
    return "AED " + Math.round(n).toLocaleString("en-AE", { maximumFractionDigits: 0 });
  }

  function calcRoi() {
    const inquiries = Number(inq && inq.value) || 0;
    const avgValue = Number(val && val.value) || 0;
    const missPct = (Number(missed && missed.value) || 0) / 100;
    const missedCount = inquiries * missPct;
    const opportunity = missedCount * avgValue;
    if (inqVal) inqVal.textContent = String(inquiries);
    if (outCount) outCount.textContent = "~" + Math.max(0, Math.round(missedCount));
    if (outValue) outValue.textContent = "~" + fmtAED(Math.max(0, opportunity));
  }

  [inq, val, missed].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", calcRoi);
  });
  const roiBtn = document.getElementById("roiCalcBtn");
  if (roiBtn) {
    roiBtn.addEventListener("click", () => {
      calcRoi();
      track("roi_calculated", {
        inquiries: inq && inq.value,
        value: val && val.value,
        missed_pct: missed && missed.value,
      });
    });
  }
  calcRoi();

  /* ---------- Hero LIVE AI EMPLOYEE demo ---------- */
  const msgBox = document.getElementById("heroMessages");
  const leadCard = document.getElementById("leadCaptureCard");
  const demoInput = document.getElementById("demoInput");
  const demoSend = document.getElementById("demoSend");
  const demoStartOver = document.getElementById("demoStartOver");
  const demoHuman = document.getElementById("demoHuman");

  const SCRIPT = [
    {
      role: "user",
      text: "Hi, I need an AC service tomorrow. How much does it cost?",
    },
    {
      role: "ai",
      text: `Absolutely. I can help with that. Our standard AC service starts from ${DEMO_PRICE} (DEMO). Would you like me to check availability for tomorrow?`,
    },
    { role: "user", text: "Yes." },
    {
      role: "ai",
      text: "Great. What time works best, and what's the best number to reach you?",
    },
    { role: "user", text: "Morning, WhatsApp +971 50 000 0000" },
    {
      role: "ai",
      text: "Thanks. I've captured your AC service request for tomorrow morning. A team member can confirm the exact slot. (This is a DEMO AI assistant — not a live booking system.)",
      capture: true,
    },
  ];

  let demoTimer = null;
  let demoRun = 0;
  let demoOpened = false;
  let userTurns = 0;
  const MAX_USER_TURNS = 12;
  let demoSessionId = null;
  let liveAiReady = null; // null unknown, true/false after probe

  async function probeApi() {
    const cfg = window.AstralForgeConfig;
    if (!cfg) {
      liveAiReady = false;
      return false;
    }
    try {
      if (typeof cfg.ensureApi === "function") await cfg.ensureApi();
      const st = await cfg.api("/api/demo/status");
      liveAiReady = Boolean(st && st.ok);
      if (liveAiReady) {
        const sess = await cfg.api("/api/demo/session", { method: "POST", body: "{}" });
        demoSessionId = sess.sessionId;
        track("demo_api_ready", { nvidia: st.providers && st.providers.nvidia });
      }
      return liveAiReady;
    } catch (_) {
      liveAiReady = false;
      return false;
    }
  }

  function showLeadCaptureData(capture) {
    if (!leadCard) return;
    leadCard.hidden = false;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el && v) el.textContent = v;
    };
    if (capture) {
      set("lcService", capture.service || "Service enquiry (DEMO)");
      set("lcDate", capture.preferredDate || "As discussed");
      set("lcContact", capture.contact || "See conversation");
    }
    track("demo_completed", { type: capture ? "live" : "scripted" });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bubble(role, text, typing) {
    if (!msgBox) return null;
    const div = document.createElement("div");
    div.className = `msg ${role}${typing ? " typing" : ""}`;
    div.innerHTML = `<span class="who">${role === "user" ? "Customer" : "AI Employee (DEMO)"}</span>${escapeHtml(text)}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
    return div;
  }

  function showLeadCapture() {
    showLeadCaptureData({
      service: "AC service",
      preferredDate: "Tomorrow",
      contact: "+971 50 000 0000 (DEMO)",
    });
  }

  function clearDemoTimers() {
    if (demoTimer) clearTimeout(demoTimer);
    demoTimer = null;
    demoRun += 1;
  }

  function playScript() {
    if (!msgBox) return;
    clearDemoTimers();
    const runId = demoRun;
    msgBox.innerHTML = "";
    if (leadCard) leadCard.hidden = true;
    userTurns = 0;

    if (!demoOpened) {
      demoOpened = true;
      track("demo_open", {});
    }

    let i = 0;
    function next() {
      if (runId !== demoRun) return;
      if (i >= SCRIPT.length) return;
      const step = SCRIPT[i++];
      if (step.role === "ai") {
        const typing = bubble("ai", "…", true);
        demoTimer = setTimeout(() => {
          if (runId !== demoRun) return;
          if (typing) typing.remove();
          bubble("ai", step.text);
          track("demo_message", { role: "ai" });
          if (step.capture) showLeadCapture();
          demoTimer = setTimeout(next, 700);
        }, 650);
      } else {
        bubble("user", step.text);
        track("demo_message", { role: "user" });
        demoTimer = setTimeout(next, 500);
      }
    }
    next();
  }

  function replyToUser(text) {
    const t = text.toLowerCase();
    track("demo_message", { role: "user", freeform: true });

    if (/human|person|agent|manager|call me/.test(t)) {
      return "I can connect you with the AstralForge team. Use Chat on WhatsApp or the lead form below — I'm a DEMO AI, not a live human.";
    }
    if (/price|cost|how much|aed/.test(t)) {
      return `For this DEMO home-services scenario, standard AC service starts from ${DEMO_PRICE}. Real pricing for your business is configured from your rate card.`;
    }
    if (/book|tomorrow|available|appointment|time/.test(t)) {
      return "In a live deployment I can collect preferred time and contact details, then create a booking request for your team. This DEMO only simulates that flow.";
    }
    if (/who are you|are you (a )?human|bot|ai/.test(t)) {
      return "I'm an AI assistant demonstration for AstralForge — not a human. I show how an AI employee can answer and capture leads for a demo business.";
    }
    if (/whatsapp/.test(t)) {
      return "WhatsApp channels can be part of a real deployment when integrations are approved. This website DEMO is browser-only.";
    }
    if (/password|credit card|iban|medical|legal advice|lawsuit/.test(t)) {
      return "I won't handle passwords, payment card details, or professional medical/legal advice. Please speak with a human for those topics.";
    }
    return "I'm a DEMO AI employee for a sample home-services business. I can answer routine questions, qualify interest and capture contact details — or you can Request a human / Get Your AI Employee below.";
  }

  async function sendUserMessage() {
    if (!demoInput || !msgBox) return;
    const text = demoInput.value.trim();
    if (!text) return;
    if (userTurns >= MAX_USER_TURNS) {
      bubble("ai", "Demo turn limit reached for this session. Start over, or request a real AI employee via the form.");
      return;
    }
    userTurns += 1;
    clearDemoTimers();
    bubble("user", text);
    demoInput.value = "";
    const typing = bubble("ai", "…", true);

    // Live NVIDIA / Azure path via AstralForge API
    if (liveAiReady !== false && window.AstralForgeConfig) {
      try {
        if (liveAiReady === null) await probeApi();
        if (liveAiReady) {
          const data = await window.AstralForgeConfig.api("/api/demo/chat", {
            method: "POST",
            body: JSON.stringify({ message: text, sessionId: demoSessionId }),
          });
          if (data.sessionId) demoSessionId = data.sessionId;
          if (typing) typing.remove();
          bubble("ai", data.reply);
          track("demo_message", { role: "ai", provider: data.provider });
          if (data.capture) showLeadCaptureData(data.capture);
          return;
        }
      } catch (err) {
        console.warn("[demo live]", err);
      }
    }

    setTimeout(() => {
      if (typing) typing.remove();
      const answer = replyToUser(text);
      bubble("ai", answer);
      if (/phone|whatsapp|\+971|contact|name is/.test(text.toLowerCase())) {
        showLeadCapture();
      }
    }, 500);
  }

  if (demoSend) demoSend.addEventListener("click", sendUserMessage);
  if (demoInput) {
    demoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendUserMessage();
      }
    });
    demoInput.addEventListener("focus", () => track("demo_open", { via: "input_focus" }));
  }
  if (demoStartOver) {
    demoStartOver.addEventListener("click", async () => {
      track("demo_restart", {});
      demoSessionId = null;
      if (liveAiReady && window.AstralForgeConfig) {
        try {
          const sess = await window.AstralForgeConfig.api("/api/demo/session", {
            method: "POST",
            body: "{}",
          });
          demoSessionId = sess.sessionId;
        } catch (_) {}
      }
      playScript();
    });
  }
  if (demoHuman) {
    demoHuman.addEventListener("click", () => {
      track("demo_human", {});
      clearDemoTimers();
      bubble(
        "ai",
        "Escalating to a human path (DEMO). Use WhatsApp +971 50 580 4276 or the form “Request My AI Demo” — a person from AstralForge will follow up."
      );
    });
  }

  // Probe API + auto-play scripted demo when hero visible
  if (msgBox) {
    probeApi().finally(() => {
      const start = () => playScript();
      if ("IntersectionObserver" in window) {
        const dio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                start();
                dio.disconnect();
              }
            });
          },
          { threshold: 0.25 }
        );
        dio.observe(msgBox);
      } else {
        start();
      }
    });
  }

  /* ---------- Lead form ---------- */
  const leadForm = document.getElementById("leadForm");
  const leadStatus = document.getElementById("leadStatus");
  const leadSuccess = document.getElementById("leadSuccess");
  const leadSubmit = document.getElementById("leadSubmit");

  function getUtm() {
    const p = new URLSearchParams(location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const out = {};
    keys.forEach((k) => {
      if (p.get(k)) out[k] = p.get(k);
    });
    return out;
  }

  if (leadForm) {
    leadForm.addEventListener("focusin", () => track("lead_form_started", {}), { once: true });

    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (leadStatus) leadStatus.textContent = "";

      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        if (leadStatus) leadStatus.textContent = "Please complete the required fields.";
        return;
      }

      const fd = new FormData(leadForm);
      const fields = Object.fromEntries(fd.entries());
      const payload = {
        timestamp: new Date().toISOString(),
        ...fields,
        source_page: fields.source_page || "homepage",
        page_url: location.href,
        ...getUtm(),
      };

      if (leadSubmit) {
        leadSubmit.disabled = true;
        leadSubmit.textContent = "Sending…";
      }

      try {
        payload.sessionId = demoSessionId || "";

        // 1) Backend API (creates lead + prospect + history)
        let apiOk = false;
        if (window.AstralForgeConfig) {
          try {
            if (typeof window.AstralForgeConfig.ensureApi === "function") {
              await window.AstralForgeConfig.ensureApi();
            }
            const res = await window.AstralForgeConfig.api("/api/leads", {
              method: "POST",
              body: JSON.stringify(payload),
            });
            apiOk = true;
            if (res.prospectId) {
              try {
                sessionStorage.setItem("af_prospect_id", res.prospectId);
              } catch (_) {}
            }
            track("lead_api_ok", { prospectId: res.prospectId });
          } catch (apiErr) {
            console.warn("[leads api]", apiErr);
          }
        }

        // 2) Always also route WhatsApp/email for human follow-up
        if (window.AstralLeadRouter && typeof window.AstralLeadRouter.sendLead === "function") {
          await window.AstralLeadRouter.sendLead(payload);
        } else if (!apiOk && window.AstralLeadRouter && typeof window.AstralLeadRouter.emailLead === "function") {
          await window.AstralLeadRouter.emailLead("AI Employee request", payload);
        } else if (!apiOk) {
          const lines = Object.entries(payload)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
          window.open(
            `https://wa.me/971505804276?text=${encodeURIComponent("New AI Employee request\n\n" + lines)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }

        track("lead_form_submitted", {
          industry: fields.industry,
          solution: fields.solution,
          plan: fields.plan,
          api: apiOk,
        });

        leadForm.hidden = true;
        if (leadSuccess) leadSuccess.hidden = false;
      } catch (err) {
        console.error(err);
        if (leadStatus) {
          leadStatus.textContent =
            "Could not send automatically. Please WhatsApp +971 50 580 4276 or email astralfconsulting@gmail.com.";
        }
      } finally {
        if (leadSubmit) {
          leadSubmit.disabled = false;
          leadSubmit.textContent = "Request My AI Demo";
        }
      }
    });
  }

  /* ---------- Payment (Stripe Checkout via Azure API) ---------- */
  async function startCheckout(packageId, btn) {
    const cfg = window.AstralForgeConfig;
    let prospectId = "";
    try {
      prospectId = sessionStorage.getItem("af_prospect_id") || "";
    } catch (_) {}

    const email =
      (leadForm && leadForm.elements.email && leadForm.elements.email.value) ||
      prompt("Email for receipt:") ||
      "";
    const name =
      (leadForm && leadForm.elements.name && leadForm.elements.name.value) || "";
    const businessName =
      (leadForm && leadForm.elements.business_name && leadForm.elements.business_name.value) || "";
    const phone =
      (leadForm && leadForm.elements.phone && leadForm.elements.phone.value) || "";

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Starting…";
    }

    try {
      if (!cfg) throw new Error("Config missing");
      if (typeof cfg.ensureApi === "function") await cfg.ensureApi();

      const data = await cfg.api("/api/checkout/session", {
        method: "POST",
        body: JSON.stringify({
          packageId,
          email: email || "customer@pending.local",
          name,
          businessName,
          prospectId: prospectId || undefined,
          phone,
        }),
      });

      track("checkout_started", {
        packageId,
        mode: data.mode,
        ref: data.paymentRef,
      });

      if (data.prospectId) {
        try {
          sessionStorage.setItem("af_prospect_id", data.prospectId);
        } catch (_) {}
      }

      // Stripe card checkout
      if (data.mode === "stripe" && data.checkoutUrl) {
        location.href = data.checkoutUrl;
        return;
      }

      // WhatsApp invoice — money tracked with REF; mark paid in /admin when funds land
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
        alert(
          "Payment request created.\n\nREF: " +
            (data.paymentRef || "") +
            "\nAmount: AED " +
            (data.setupAed || "") +
            "\n\nWhatsApp opened for the customer.\nWhen money arrives, open /admin → Mark paid."
        );
        return;
      }

      throw new Error("No payment path returned");
    } catch (err) {
      console.error(err);
      window.open(
        "https://wa.me/971505804276?text=" +
          encodeURIComponent(`Hi AstralForge, I want to pay for ${packageId} AI employee.`),
        "_blank",
        "noopener,noreferrer"
      );
      alert("Could not reach payment API. WhatsApp opened as backup.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent =
          packageId === "business" ? "Pay setup · AED 1,999" : "Pay setup · AED 999";
      }
    }
  }

  document.querySelectorAll(".pay-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pkg = btn.getAttribute("data-package");
      if (pkg) startCheckout(pkg, btn);
    });
  });

  // Payment return banner
  const payParams = new URLSearchParams(location.search);
  if (payParams.get("payment") === "success") {
    track("payment_return_success", { session: payParams.get("session_id") });
    const banner = document.createElement("div");
    banner.className = "pay-banner ok";
    banner.innerHTML =
      "<strong>Payment received.</strong> Thank you — we'll contact you about onboarding. WhatsApp +971 50 580 4276 if you need anything.";
    document.body.prepend(banner);
  } else if (payParams.get("payment") === "cancel") {
    track("payment_return_cancel", {});
  }
})();

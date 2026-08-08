(() => {
  "use strict";

  /* ---------- Analytics ---------- */
  function track(event, props) {
    const payload = { event, ...(props || {}), ts: Date.now() };
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (_) {}
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", event, props || {});
      }
    } catch (_) {}
    if (location.hostname === "localhost" || location.search.includes("debug=1")) {
      console.info("[af-track]", event, props || {});
    }
  }
  window.afTrack = track;

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    track(el.getAttribute("data-track"), {
      href: el.getAttribute("href") || "",
      text: (el.textContent || "").trim().slice(0, 80),
    });
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
        const match = [...sel.options].find((o) => o.value === p);
        if (match) sel.value = p;
        else sel.value = "Not sure";
      }
    });
  });
  document.querySelectorAll("[data-plan]").forEach((el) => {
    el.addEventListener("click", () => {
      const plan = el.getAttribute("data-plan");
      const field = document.getElementById("planField");
      const budget = document.getElementById("budgetSelect");
      if (field) field.value = plan || "Business";
      if (budget) {
        if (plan === "Starter") budget.value = "Under AED 1,000";
        else if (plan === "Business") budget.value = "AED 1,000–2,500";
        else if (plan === "Custom") budget.value = "AED 5,000+";
      }
      track("pricing_plan_selected", { plan });
    });
  });

  /* ---------- ROI calculator ---------- */
  const inq = document.getElementById("roiInquiries");
  const val = document.getElementById("roiValue");
  const conv = document.getElementById("roiConv");
  const lift = document.getElementById("roiLift");
  const inqVal = document.getElementById("inqVal");
  const outLeads = document.getElementById("roiLeads");
  const outRev = document.getElementById("roiRevenue");
  const outAnn = document.getElementById("roiAnnual");

  function fmtAED(n) {
    return (
      "AED " +
      Math.round(n).toLocaleString("en-AE", { maximumFractionDigits: 0 })
    );
  }

  function calcRoi() {
    const inquiries = Number(inq && inq.value) || 0;
    const avgValue = Number(val && val.value) || 0;
    const convRate = (Number(conv && conv.value) || 0) / 100;
    const liftRate = (Number(lift && lift.value) || 0) / 100;

    // Estimate: additional conversions ≈ inquiries * current_conv * lift
    // Additional qualified leads ≈ inquiries * lift * 0.35 (portion that become "qualified" extras)
    const extraLeads = inquiries * liftRate * 0.35;
    const extraCustomers = inquiries * convRate * liftRate;
    const monthlyRev = extraCustomers * avgValue;
    const annual = monthlyRev * 12;

    if (inqVal) inqVal.textContent = String(inquiries);
    if (outLeads) outLeads.textContent = "~" + Math.max(0, Math.round(extraLeads));
    if (outRev) outRev.textContent = "~" + fmtAED(Math.max(0, monthlyRev));
    if (outAnn) outAnn.textContent = "~" + fmtAED(Math.max(0, annual));
  }

  [inq, val, conv, lift].forEach((el) => {
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
        conv: conv && conv.value,
        lift: lift && lift.value,
      });
    });
  }
  calcRoi();

  /* ---------- Demo ---------- */
  const SCRIPTS = {
    sales: {
      label: "AI Sales Employee · Online",
      chips: ["How much for AC maintenance?", "Do you cover Dubai Marina?", "I need a quote today"],
      steps: [
        { role: "user", text: "How much does AC maintenance cost?" },
        {
          role: "ai",
          text: "Absolutely — I can help. Is this for a residential or commercial property, and how many units need servicing?",
        },
        { role: "user", text: "Residential villa, 3 indoor units in Dubai Marina." },
        {
          role: "ai",
          text: "Got it — villa, 3 units, Dubai Marina. Preferred day this week, and is this urgent or routine maintenance?",
        },
        { role: "user", text: "Routine, prefer Thursday. Name is Omar." },
        {
          role: "ai",
          text: "Thank you, Omar. Captured: villa · 3 units · Dubai Marina · Thursday · routine. A specialist will confirm your quote shortly.",
        },
      ],
    },
    support: {
      label: "AI Support Employee · Online",
      chips: ["What are your working hours?", "Emergency after midnight?"],
      steps: [
        { role: "user", text: "What are your working hours?" },
        {
          role: "ai",
          text: "We’re open Sun–Thu 9:00–18:00 and Sat 10:00–14:00 (UAE). AI help is available 24/7 for FAQs. How can I help?",
        },
        { role: "user", text: "Do you offer emergency AC service after midnight?" },
        {
          role: "ai",
          text: "Yes — after-hours emergencies are accepted. I can log location, unit type and issue, then escalate to on-call. What’s happening with the AC?",
        },
      ],
    },
    booking: {
      label: "AI Booking Employee · Online",
      chips: ["Book a visit", "Deep clean Wednesday"],
      steps: [
        { role: "user", text: "I want to book a service visit this week." },
        {
          role: "ai",
          text: "Happy to book that. Which service, and preferred day and time window?",
        },
        { role: "user", text: "Deep cleaning for a 2BR — Wednesday afternoon." },
        {
          role: "ai",
          text: "Perfect. Full name, WhatsApp number and building area for the Wednesday afternoon slot?",
        },
        { role: "user", text: "Sara, +97155…, JLT Cluster Y." },
        {
          role: "ai",
          text: "Thanks, Sara. Booking request ready: deep clean · 2BR · JLT · Wednesday afternoon. Team will confirm exact time on WhatsApp.",
        },
      ],
    },
  };

  const msgBox = document.getElementById("demoMessages");
  const chipsBox = document.getElementById("demoChips");
  const roleLabel = document.getElementById("demoRoleLabel");
  let demoTimer = null;
  let demoRun = 0;
  let demoStarted = false;
  let demoCompleted = false;

  function clearTimers() {
    if (demoTimer) clearTimeout(demoTimer);
    demoTimer = null;
    demoRun += 1;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bubble(role, text, typing) {
    const div = document.createElement("div");
    div.className = `msg ${role}${typing ? " typing" : ""}`;
    div.innerHTML = `<span class="who">${role === "user" ? "Customer" : "AI employee"}</span>${escapeHtml(text)}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
    return div;
  }

  function playDemo(key) {
    const script = SCRIPTS[key] || SCRIPTS.sales;
    clearTimers();
    const runId = demoRun;
    if (!demoStarted) {
      demoStarted = true;
      track("demo_start", { role: key });
    } else {
      track("demo_role_change", { role: key });
    }
    demoCompleted = false;
    if (roleLabel) roleLabel.textContent = script.label;
    if (msgBox) msgBox.innerHTML = "";
    if (chipsBox) {
      chipsBox.innerHTML = "";
      script.chips.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = c;
        b.addEventListener("click", () => playDemo(key));
        chipsBox.appendChild(b);
      });
    }

    let i = 0;
    const next = () => {
      if (runId !== demoRun) return;
      if (i >= script.steps.length) {
        if (!demoCompleted) {
          demoCompleted = true;
          track("demo_complete", { role: key });
        }
        return;
      }
      const step = script.steps[i];
      if (step.role === "ai") {
        const t = bubble("ai", "Typing…", true);
        demoTimer = setTimeout(() => {
          if (runId !== demoRun) return;
          t.remove();
          bubble("ai", step.text, false);
          i += 1;
          demoTimer = setTimeout(next, 700);
        }, 650);
      } else {
        bubble("user", step.text, false);
        i += 1;
        demoTimer = setTimeout(next, 550);
      }
    };
    demoTimer = setTimeout(next, 350);
  }

  document.querySelectorAll(".demo-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".demo-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      playDemo(tab.getAttribute("data-demo"));
    });
  });
  playDemo("sales");

  /* ---------- Forms ---------- */
  async function submitLead(opts) {
    const { data, subject, formType, statusEl, onOk } = opts;
    const waText =
      `Hello AstralForge AI Sales — ${formType}\n` +
      Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

    track(`${formType}_submit_attempt`, { product: data.product || data.plan || "" });

    try {
      if (window.AstralLeadRouter && typeof window.AstralLeadRouter.deliverLead === "function") {
        await window.AstralLeadRouter.deliverLead({
          channel: "sales",
          subject,
          fields: { ...data, form_type: formType, source: "website", status: "NEW" },
          waText,
        });
      } else {
        window.open(
          `https://wa.me/971505804276?text=${encodeURIComponent(waText)}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
      track(`${formType}_submit_success`);
      if (onOk) onOk();
      else if (statusEl) {
        statusEl.className = "form-status ok";
        statusEl.textContent = "Sent — WhatsApp opened. We’ll follow up.";
      }
    } catch (_) {
      track(`${formType}_submit_error`);
      if (statusEl) {
        statusEl.className = "form-status err";
        statusEl.textContent = "Something went wrong. Please WhatsApp sales directly.";
      }
    }
  }

  const auditForm = document.getElementById("auditForm");
  const auditStatus = document.getElementById("auditStatus");
  const auditSuccess = document.getElementById("auditSuccess");
  const auditSubmit = document.getElementById("auditSubmit");

  if (auditForm) {
    auditForm.addEventListener("focusin", () => track("audit_form_start"), { once: true });
    auditForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(auditForm).entries());
      if (!data.name || !data.phone || !data.email || !data.business_name || !data.business_type || !data.problem) {
        if (auditStatus) {
          auditStatus.className = "form-status err";
          auditStatus.textContent = "Please complete all required fields.";
        }
        return;
      }
      if (auditSubmit) {
        auditSubmit.disabled = true;
        auditSubmit.textContent = "Sending…";
      }
      await submitLead({
        data,
        subject: `AI Audit — ${data.business_name} — ${data.product}`,
        formType: "audit",
        statusEl: auditStatus,
        onOk: () => {
          auditForm.hidden = true;
          if (auditSuccess) auditSuccess.hidden = false;
        },
      });
      if (auditSubmit) {
        auditSubmit.disabled = false;
        auditSubmit.textContent = "Analyze my business";
      }
    });
  }

  const planForm = document.getElementById("planForm");
  const planStatus = document.getElementById("planStatus");
  if (planForm) {
    planForm.addEventListener("focusin", () => track("plan_form_start"), { once: true });
    planForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(planForm).entries());
      if (!data.name || !data.phone || !data.email || !data.company || !data.industry || !data.message) {
        if (planStatus) {
          planStatus.className = "form-status err";
          planStatus.textContent = "Please complete required fields.";
        }
        return;
      }
      const btn = planForm.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      await submitLead({
        data,
        subject: `AI Plan Request — ${data.company} — ${data.plan || "Business"}`,
        formType: "plan",
        statusEl: planStatus,
      });
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Request my AI plan";
      }
      planForm.reset();
    });
  }

  /* ---------- Exit intent (desktop only, once / session) ---------- */
  const exitModal = document.getElementById("exitModal");
  let exitShown = sessionStorage.getItem("af_exit") === "1";

  function showExit() {
    if (exitShown || !exitModal) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    exitShown = true;
    sessionStorage.setItem("af_exit", "1");
    exitModal.hidden = false;
    track("exit_intent_shown");
  }

  document.addEventListener("mouseout", (e) => {
    if (e.clientY <= 0) showExit();
  });

  if (exitModal) {
    exitModal.querySelectorAll("[data-exit-close]").forEach((el) => {
      el.addEventListener("click", () => {
        exitModal.hidden = true;
        track("exit_intent_closed");
      });
    });
  }

  track("page_view", { path: location.pathname });
})();

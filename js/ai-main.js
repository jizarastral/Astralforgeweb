(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

  /* Product deep-links into form */
  document.querySelectorAll("[data-product]").forEach((el) => {
    el.addEventListener("click", () => {
      const p = el.getAttribute("data-product");
      const sel = document.getElementById("productSelect");
      if (p && sel) {
        const opt = [...sel.options].find((o) => o.value === p);
        if (opt) sel.value = p;
        else {
          sel.value = "Custom industry AI employee";
        }
      }
    });
  });

  /* ========== Interactive demo ========== */
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
          text: "Got it — villa, 3 units, Dubai Marina. To prepare an accurate quote: preferred day this week, and is this urgent (cooling issue) or routine maintenance?",
        },
        { role: "user", text: "Routine, prefer Thursday. My name is Omar, +97150…" },
        {
          role: "ai",
          text: "Thank you, Omar. I’ve captured: residential villa · 3 units · Dubai Marina · Thursday · routine maintenance. A specialist will confirm your quote and slot shortly. Anything else before I hand this over?",
        },
      ],
    },
    support: {
      label: "AI Support Employee · Online",
      chips: ["What are your working hours?", "Where are you located?", "Do you offer emergency service?"],
      steps: [
        { role: "user", text: "What are your working hours?" },
        {
          role: "ai",
          text: "We’re open Sunday–Thursday 9:00–18:00, and Saturday 10:00–14:00 (UAE time). Our AI assistant is available 24/7 for FAQs and urgent triage. How can I help you today?",
        },
        { role: "user", text: "Do you offer emergency AC service after midnight?" },
        {
          role: "ai",
          text: "Yes — after-hours emergency calls are accepted. I can log your location, unit type, and issue now, then escalate to the on-call team. What’s the property area and what’s happening with the AC?",
        },
      ],
    },
    booking: {
      label: "AI Booking Employee · Online",
      chips: ["Book a visit", "I need a haircut Saturday", "Can I reschedule?"],
      steps: [
        { role: "user", text: "I want to book a service visit this week." },
        {
          role: "ai",
          text: "Happy to book that. Which service do you need, and what’s your preferred day and time window?",
        },
        { role: "user", text: "Deep cleaning for a 2BR apartment — Wednesday afternoon." },
        {
          role: "ai",
          text: "Perfect. May I take your full name, WhatsApp number, and building area so we can confirm the Wednesday afternoon slot?",
        },
        { role: "user", text: "Sara Al Maktoum, +97155…, JLT Cluster Y." },
        {
          role: "ai",
          text: "Thanks, Sara. Booking request ready: deep clean · 2BR · JLT Cluster Y · Wednesday afternoon. Our team will confirm exact time and send details on WhatsApp.",
        },
      ],
    },
  };

  const msgBox = document.getElementById("demoMessages");
  const chipsBox = document.getElementById("demoChips");
  const roleLabel = document.getElementById("demoRoleLabel");
  let demoTimer = null;
  let demoRun = 0;

  function clearTimers() {
    if (demoTimer) {
      clearTimeout(demoTimer);
      demoTimer = null;
    }
    demoRun += 1;
  }

  function bubble(role, text, typing) {
    const div = document.createElement("div");
    div.className = `msg ${role}${typing ? " typing" : ""}`;
    div.innerHTML = `<span class="who">${role === "user" ? "Customer" : "AI employee"}</span>${escapeHtml(text)}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
    return div;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function playDemo(key) {
    const script = SCRIPTS[key] || SCRIPTS.sales;
    clearTimers();
    const runId = demoRun;
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
      if (i >= script.steps.length) return;
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

  /* Lead form */
  const form = document.getElementById("leadForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("leadSubmit");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      if (!data.name || !data.phone || !data.email || !data.business_type) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "Please complete name, phone, email and business type.";
        }
        return;
      }

      const waText =
        `Hello AstralForge AI Sales — AI employee request\n` +
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `Email: ${data.email}\n` +
        `Business: ${data.business_type}\n` +
        `Product: ${data.product || "—"}\n` +
        `Channels: ${data.channels || "—"}\n` +
        `Priority: ${data.message || "—"}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (status) {
        status.className = "form-status";
        status.textContent = "Routing your request…";
      }

      try {
        if (window.AstralLeadRouter && typeof window.AstralLeadRouter.deliverLead === "function") {
          await window.AstralLeadRouter.deliverLead({
            channel: "sales",
            subject: `AstralForge AI lead — ${data.business_type} — ${data.product}`,
            fields: data,
            waText,
          });
        } else {
          window.open(
            `https://wa.me/971554458850?text=${encodeURIComponent(waText)}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
        if (status) {
          status.className = "form-status ok";
          status.textContent = "Done — WhatsApp opened. We’ll follow up on your lead.";
        }
        form.reset();
      } catch (_) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "Something went wrong. Please WhatsApp sales directly.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Get my AI employee";
        }
      }
    });
  }
})();

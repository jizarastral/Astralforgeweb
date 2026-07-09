(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Sticky nav */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
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

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Hero items visible immediately */
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 80 + i * 90);
  });

  /* Parallax-ish mouse glow on contact panel */
  const panel = document.querySelector(".contact-panel");
  if (panel && window.matchMedia("(pointer: fine)").matches) {
    panel.addEventListener("pointermove", (e) => {
      const rect = panel.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      panel.style.background = `
        radial-gradient(600px circle at ${x}% ${y}%, rgba(94,231,255,0.08), transparent 40%),
        rgba(14, 22, 42, 0.65)
      `;
    });
  }

  /* Quote form — every lead → Gmail + Sales WhatsApp */
  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    const LEAD_EMAIL = "astralfconsulting@gmail.com";
    const SALES_WA = "971554458850";
    const serviceSelect = document.getElementById("service");
    const hvacFields = document.getElementById("hvacFields");
    const formError = document.getElementById("formError");
    const formSuccess = document.getElementById("formSuccess");

    const toggleHvac = () => {
      if (!serviceSelect || !hvacFields) return;
      const isHvac = (serviceSelect.value || "").toLowerCase().includes("hvac");
      hvacFields.hidden = !isHvac;
    };

    serviceSelect?.addEventListener("change", toggleHvac);
    toggleHvac();

    const val = (id) => {
      const el = document.getElementById(id);
      return el ? String(el.value || "").trim() : "";
    };

    const buildMessage = () => {
      const lines = [
        "New quote request — AstralForgeAE",
        "",
        `Name: ${val("name")}`,
        `Company: ${val("company") || "—"}`,
        `Email: ${val("email")}`,
        `Phone: ${val("phone")}`,
        `Service: ${val("service")}`,
        `Location: ${val("location") || "—"}`,
        `Timeline: ${val("timeline") || "—"}`,
      ];

      if ((val("service") || "").toLowerCase().includes("hvac")) {
        lines.push(`Floors: ${val("floors") || "—"}`);
        lines.push(`HVAC type: ${val("hvacType") || "—"}`);
      }

      lines.push("", "Details:", val("details"));
      return lines.join("\n");
    };

    const deliverLead = async (subject, fields, waText) => {
      let emailOk = false;
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
        emailOk = res.ok;
      } catch (_) {
        emailOk = false;
      }
      window.open(
        `https://wa.me/${SALES_WA}?text=${encodeURIComponent(waText)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return emailOk;
    };

    quoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }
      if (formSuccess) formSuccess.hidden = true;

      const required = [
        ["name", "Full name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["service", "Service"],
        ["details", "Project details"],
      ];

      for (const [id, label] of required) {
        if (!val(id)) {
          if (formError) {
            formError.textContent = `Please fill in: ${label}.`;
            formError.hidden = false;
          }
          document.getElementById(id)?.focus();
          return;
        }
      }

      const email = val("email");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (formError) {
          formError.textContent = "Please enter a valid email address.";
          formError.hidden = false;
        }
        document.getElementById("email")?.focus();
        return;
      }

      const message = buildMessage();
      const submitBtns = quoteForm.querySelectorAll('button[type="submit"]');
      submitBtns.forEach((b) => {
        b.disabled = true;
      });

      const fields = {
        type: "quote",
        name: val("name"),
        company: val("company") || "—",
        email: val("email"),
        phone: val("phone"),
        service: val("service"),
        location: val("location") || "—",
        timeline: val("timeline") || "—",
        floors: val("floors") || "—",
        hvac_type: val("hvacType") || "—",
        details: val("details"),
        source: "astralforgeweb.onrender.com/quote",
      };

      const emailOk = await deliverLead(
        `AstralForgeAE quote — ${val("service")} — ${val("name")}`,
        fields,
        message
      );

      submitBtns.forEach((b) => {
        b.disabled = false;
      });

      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.textContent = emailOk
          ? "Lead sent to email + WhatsApp sales. Complete the WhatsApp send if it opened."
          : "WhatsApp opened for sales. Confirm FormSubmit in Gmail once so email delivery works.";
      }
    });
  }
})();

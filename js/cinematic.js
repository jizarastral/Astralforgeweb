/**
 * AstralForgeAE — Cinematic scroll masterpiece
 */
(function () {
  const SERVICES = [
    {
      num: "01",
      title: "Shop drawings",
      text: "Production-ready shop drawings, elevations, sections, and details — coordinated for installers and fabricators.",
      img: "assets/images/services/drawings.jpg",
    },
    {
      num: "02",
      title: "Aluminium & glass fabrication",
      text: "Curtain walls, windows, doors, spider glazing, and aluminium systems — advanced façade fabrication for UAE projects.",
      img: "assets/images/service-glass.jpg",
    },
    {
      num: "03",
      title: "Interior fitouts",
      text: "AsBuilt-grade interiors — partitions, finishes, and premium packages for residential and commercial spaces.",
      img: "assets/images/fitout/fitout-01.jpg",
    },
    {
      num: "04",
      title: "HVAC (G+20)",
      text: "Installation and commissioning up to G+20 — chillers, FCU, VRF, and full duct systems.",
      img: "assets/images/services/hvac.jpg",
    },
    {
      num: "05",
      title: "Structuring",
      text: "Structural interfaces, framing intent, and buildable detailing for lasting integrity.",
      img: "assets/images/services/structure.jpg",
    },
    {
      num: "06",
      title: "MEP",
      text: "Mechanical, electrical, and plumbing as one coordinated package on site.",
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "07",
      title: "Fire systems",
      text: "Life-safety: detection, alarms, suppression, and authority-minded coordination.",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "08",
      title: "Security & surveillance",
      text: "CCTV, access control, and layered security design for people and assets.",
      img: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "09",
      title: "Strong room",
      text: "High-security rooms and vault-grade enclosures with controlled access pathways.",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "10",
      title: "LED display",
      text: "Media facades, indoor/outdoor LED walls, and display system integration.",
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "11",
      title: "Landscaping",
      text: "Outdoor works and site finishing that complete the architectural experience.",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "12",
      title: "Advertising & sign boards",
      text: "Brand signage, wayfinding, and advertising structures — fab + install.",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
    },
    {
      num: "13",
      title: "IT solutions",
      text: "Websites, portals, automation, and digital support for operational businesses.",
      img: "assets/images/services/it.jpg",
    },
    {
      num: "14",
      title: "3D printing",
      text: "Prototypes, mock-ups, and custom additive parts that accelerate decisions.",
      img: "assets/images/services/print3d.jpg",
    },
  ];

  const MOBILE_COPY = [
    { t: "Astral shop", b: "Shop first — gadgets & lifestyle. Then the full forge story." },
    { t: "Shop drawings", b: "Every build begins as a line." },
    { t: "Aluminium & glass", b: "Facades forged in metal & light." },
    { t: "Interior fitouts", b: "Spaces that feel finished." },
    { t: "HVAC G+20", b: "Climate engineered to perform." },
    { t: "Structure", b: "From structure…", s: true },
    { t: "MEP", b: "Mechanical · Electrical · Plumbing." },
    { t: "Fire systems", b: "Protection that is non-negotiable." },
    { t: "Security", b: "Eyes on every critical edge." },
    { t: "Strong rooms", b: "to strong rooms", s: true },
    { t: "LED display", b: "Facades that speak in light." },
    { t: "Landscaping", b: "Grounds that complete the project." },
    { t: "Sign boards", b: "Identity fixed in steel & light." },
    { t: "IT solutions", b: "Digital systems for real operations." },
    { t: "3D form", b: "to 3D form", s: true },
    { t: "Astral shop", b: "Everyday products. Same forge. Instant checkout." },
    { t: "One forge", b: "Projects on site. Products online." },
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function isMobile() {
    return window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;
  }

  function fillServices() {
    const grid = $("#service-grid");
    if (!grid) return;
    grid.innerHTML = SERVICES.map(
      (s) => `
      <article class="service-card">
        <div class="thumb" style="background-image:url('${s.img}')"></div>
        <div class="body">
          <span class="num">${s.num}</span>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </article>`
    ).join("");
  }

  function setProgress(p) {
    const fill = $("#loader-fill");
    const pct = $("#loader-pct");
    const v = Math.round(p * 100);
    if (fill) fill.style.width = `${v}%`;
    if (pct) pct.textContent = `${v}%`;
  }

  function loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => resolve();
      img.src = url;
    });
  }

  async function preload() {
    const first = [
      "assets/images/logo-star.jpg",
      "assets/images/hero.jpg",
      "assets/images/services/drawings.jpg",
      "assets/images/services/hvac.jpg",
    ];
    let done = 0;
    setProgress(0.05);
    await Promise.all(
      first.map((u) =>
        loadImage(u).then(() => {
          done += 1;
          setProgress(0.05 + (done / first.length) * 0.7);
        })
      )
    );
    // warm video
    await new Promise((r) => {
      const v = document.createElement("video");
      v.preload = "auto";
      v.muted = true;
      v.src = "assets/video/hero-fabrication.mp4";
      const fin = () => {
        setProgress(0.95);
        r();
      };
      v.addEventListener("loadeddata", fin, { once: true });
      v.addEventListener("error", fin, { once: true });
      setTimeout(fin, 2200);
    });
    setProgress(1);
  }

  function initCinematic() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const pin = $("#pin-wrap");
    const stage = $("#stage");
    const bar = $("#progress-bar");
    const hint = $("#scroll-indicator");
    if (!pin || !stage) return;

    const scenes = $$(".scene", stage);
    const n = scenes.length;

    let LenisCtor = window.Lenis;
    let lenis = null;
    if (typeof LenisCtor === "function") {
      lenis = new LenisCtor({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${window.innerHeight * n * 0.95}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (bar) bar.style.width = `${self.progress * 100}%`;
          if (hint) hint.classList.toggle("is-hidden", self.progress > 0.03);
        },
      },
    });

    scenes.forEach((scene, i) => {
      const media = scene.querySelector(".scene-media");
      const content = scene.querySelector(".scene-content");
      const video = scene.querySelector("video");
      const blueprint = scene.querySelector(".scene-blueprint");
      const seg = 1;

      if (i === 0) {
        gsap.set(scene, { opacity: 1, visibility: "visible", scale: 1 });
        scene.classList.add("is-active");
        video?.play?.().catch(() => {});
      } else {
        gsap.set(scene, { opacity: 0, visibility: "hidden", scale: 1.05 });
      }

      if (i > 0) {
        tl.to(
          scene,
          {
            opacity: 1,
            visibility: "visible",
            scale: 1,
            duration: seg * 0.42,
            onStart: () => {
              scene.classList.add("is-active");
              video?.play?.().catch(() => {});
            },
          },
          i * seg
        );
        tl.to(
          scenes[i - 1],
          {
            opacity: 0,
            scale: 0.97,
            duration: seg * 0.42,
            onComplete: () => {
              scenes[i - 1].classList.remove("is-active");
              scenes[i - 1].querySelector("video")?.pause?.();
            },
          },
          i * seg
        );
      }

      if (media) {
        tl.fromTo(
          media,
          { y: 0, scale: 1 },
          { y: -32, scale: 1.06, duration: seg, ease: "none" },
          i * seg
        );
      }
      if (blueprint && i === 1) {
        tl.fromTo(blueprint, { opacity: 0 }, { opacity: 0.45, duration: 0.6 }, i * seg);
      }
      if (content) {
        tl.fromTo(
          content,
          { y: 42, opacity: 0 },
          { y: 0, opacity: 1, duration: seg * 0.42 },
          i * seg + 0.08
        );
        tl.to(content, { y: -18, duration: seg * 0.42 }, i * seg + 0.52);
      }
      if (i < n - 1) tl.to({}, { duration: seg * 0.28 }, i * seg + 0.55);
    });

    // mouse tilt
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        tx = (e.clientY / window.innerHeight - 0.5) * -5;
        ty = (e.clientX / window.innerWidth - 0.5) * 5;
      },
      { passive: true }
    );
    gsap.ticker.add(() => {
      rx += (tx - rx) * 0.05;
      ry += (ty - ry) * 0.05;
      stage.style.transform = `rotateX(${rx * 0.12}deg) rotateY(${ry * 0.12}deg)`;
    });

    $$(".service-card, .process-card, .stat-card, .coming-card, .shop-card").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 92%" },
        y: 26,
        opacity: 0,
        duration: 0.6,
        delay: (i % 3) * 0.05,
        ease: "power2.out",
      });
    });
  }

  function initMobile() {
    const cinematic = $("#cinematic");
    const mobile = $("#mobile-exp");
    const track = $("#mobile-track");
    const dots = $("#m-dots");
    const bar = $("#progress-bar");
    if (!mobile || !track) return;

    if (cinematic) {
      const pin = $("#pin-wrap");
      if (pin) pin.style.display = "none";
    }
    mobile.hidden = false;

    const sceneMedias = $$(".scene .scene-media");
    const slides = MOBILE_COPY.map((c, i) => {
      const media = sceneMedias[i];
      const video = media?.querySelector("video");
      const img = media?.querySelector("img");
      const src = video?.getAttribute("src") || img?.getAttribute("src") || "assets/images/hero.jpg";
      const isVid = Boolean(video);
      const el = document.createElement("div");
      el.className = `mobile-slide${i === 0 ? " is-active" : ""}`;
      el.innerHTML = `
        ${
          isVid
            ? `<video src="${src}" poster="assets/images/hero.jpg" muted playsinline loop ${i === 0 ? "autoplay" : ""}></video>`
            : `<img src="${src}" alt="" />`
        }
        <div class="ov"></div>
        <div class="copy">
          ${c.s ? `<span class="script">${c.t}</span>` : `<h2>${c.t}</h2>`}
          <p>${c.b}</p>
        </div>`;
      track.appendChild(el);
      const d = document.createElement("button");
      d.type = "button";
      if (i === 0) d.classList.add("is-active");
      d.addEventListener("click", () => go(i));
      dots.appendChild(d);
      return el;
    });

    let index = 0;
    let touchX = 0;
    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, j) => {
        s.classList.toggle("is-active", j === index);
        const v = s.querySelector("video");
        if (v) {
          if (j === index) v.play().catch(() => {});
          else v.pause();
        }
      });
      $$("button", dots).forEach((d, j) => d.classList.toggle("is-active", j === index));
      if (bar) bar.style.width = `${((index + 1) / slides.length) * 100}%`;
    }
    $("#m-prev")?.addEventListener("click", () => go(index - 1));
    $("#m-next")?.addEventListener("click", () => go(index + 1));
    track.addEventListener(
      "touchstart",
      (e) => {
        touchX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
    go(0);
  }

  function wireContact() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get("name") || "";
      const email = fd.get("email") || "";
      const phone = fd.get("phone") || "";
      const interest = fd.get("interest") || "";
      const message = fd.get("message") || "";
      const waText = [
        "Hello AstralForgeAE Sales!",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        `Interest: ${interest}`,
        `Message: ${message || "—"}`,
      ].join("\n");

      if (window.AstralLeadRouter?.deliverLead) {
        await window.AstralLeadRouter.deliverLead({
          channel: "sales",
          subject: `AstralForgeAE lead — ${interest} — ${name}`,
          fields: { name, email, phone, interest, message },
          waText,
        });
      } else {
        window.open(
          `https://wa.me/971554458850?text=${encodeURIComponent(waText)}`,
          "_blank",
          "noopener"
        );
      }
    });
  }

  async function main() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
    fillServices();
    wireContact();
    window.AstralLeadRouter?.wireDualWaLinks?.();

    await preload();
    await new Promise((r) => setTimeout(r, 250));
    $("#loader")?.classList.add("is-done");

    if (isMobile()) initMobile();
    else initCinematic();

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    main().catch((err) => {
      console.error(err);
      $("#loader")?.classList.add("is-done");
      fillServices();
      if (isMobile()) initMobile();
      else initCinematic();
    });
  });
})();

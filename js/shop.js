/**
 * Astral shop — live products from Shopify storefront
 * Store: https://astralae.myshopify.com/
 */
(function () {
  const STORE = "https://astralae.myshopify.com";
  const API = `${STORE}/products.json?limit=24`;

  function money(price) {
    const n = Number(price);
    if (Number.isNaN(n)) return price;
    return `$${n.toFixed(2)}`;
  }

  function stripHtml(html) {
    const d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || d.innerText || "").trim().slice(0, 120);
  }

  function cardHTML(p) {
    const v = p.variants && p.variants[0];
    const price = v ? v.price : "—";
    const compare = v && v.compare_at_price ? v.compare_at_price : null;
    const img =
      (p.images && p.images[0] && p.images[0].src) ||
      "assets/images/logo-star.jpg";
    const url = `${STORE}/products/${p.handle}`;
    const type = p.product_type || "Product";
    const blurb = stripHtml(p.body_html) || "Curated by AstralForge.";
    const sale =
      compare && Number(compare) > Number(price)
        ? `<span class="shop-compare">${money(compare)}</span>`
        : "";

    return `
      <article class="shop-card">
        <a class="shop-card-media" href="${url}" target="_blank" rel="noopener noreferrer">
          <img src="${img}" alt="${p.title.replace(/"/g, "&quot;")}" loading="lazy" />
          <span class="shop-type">${type}</span>
        </a>
        <div class="shop-card-body">
          <h3><a href="${url}" target="_blank" rel="noopener noreferrer">${p.title}</a></h3>
          <p class="shop-blurb">${blurb}${blurb.length >= 120 ? "…" : ""}</p>
          <div class="shop-price-row">
            <span class="shop-price">${money(price)}</span>
            ${sale}
          </div>
          <a class="btn btn-primary shop-buy" href="${url}" target="_blank" rel="noopener noreferrer"
            >Buy on store ↗</a
          >
        </div>
      </article>`;
  }

  async function loadShop() {
    const grid = document.getElementById("shop-grid");
    const loading = document.getElementById("shop-loading");
    if (!grid) return;

    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error("Shopify products unavailable");
      const data = await res.json();
      const products = data.products || [];
      if (!products.length) throw new Error("No products yet");

      grid.innerHTML = products.map(cardHTML).join("");

      // subtle entrance if gsap present
      if (window.gsap && window.ScrollTrigger) {
        grid.querySelectorAll(".shop-card").forEach((el, i) => {
          window.gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 92%" },
            y: 28,
            opacity: 0,
            duration: 0.55,
            delay: (i % 4) * 0.06,
            ease: "power2.out",
          });
        });
      }
    } catch (err) {
      if (loading) {
        loading.innerHTML = `
          Couldn’t load live products right now.
          <a href="${STORE}" target="_blank" rel="noopener noreferrer" style="color:var(--cyan)">Open the store ↗</a>`;
      } else {
        grid.innerHTML = `<p class="shop-loading"><a href="${STORE}" target="_blank" rel="noopener">Open Astral shop ↗</a></p>`;
      }
      console.warn("[Astral shop]", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadShop);
  } else {
    loadShop();
  }
})();

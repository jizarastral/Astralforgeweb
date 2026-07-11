(() => {
  const STORAGE_KEY = "astralforge_staff_quote_v1";
  const ratebook = window.RATEBOOK;
  const fmt = (n) =>
    `${ratebook.currency} ${Number(n || 0).toLocaleString("en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const state = {
    customer: {
      name: "",
      phone: "",
      email: "",
      project: "",
      location: "",
      notes: "",
      quoteNo: nextQuoteNo(),
      date: new Date().toISOString().slice(0, 10),
      discount: 0,
    },
    lines: [], // { uid, itemId, description, category, uom, unitPrice, qty }
    filterCat: "ALL",
    search: "",
  };

  function nextQuoteNo() {
    const d = new Date();
    const y = d.getFullYear().toString().slice(2);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const r = String(Math.floor(Math.random() * 900) + 100);
    return `AF-QT-${y}${m}-${r}`;
  }

  function uid() {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.customer) state.customer = { ...state.customer, ...data.customer };
      if (Array.isArray(data.lines)) state.lines = data.lines;
    } catch (_) {}
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ customer: state.customer, lines: state.lines })
    );
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function categories() {
    const set = new Set(ratebook.items.map((i) => i.category));
    return ["ALL", ...set];
  }

  function shortCat(c) {
    const map = {
      PRELIMINARIES: "Prelim",
      "DEMOLITION WORKS": "Demo",
      "PARTITIONS & CIVIL": "Partition",
      "CEILING WORKS": "Ceiling",
      "PAINTING WORKS": "Paint",
      FLOORING: "Floor",
      "DOORS & JOINERY": "Doors",
      "GLASS & ALUMINIUM": "Glass",
      "ELECTRICAL WORKS": "Electrical",
      "DATA & ELV": "Data/ELV",
      "HVAC WORKS": "HVAC",
      PLUMBING: "Plumbing",
      "FIRE & SAFETY": "Fire",
      "BLINDS & SOFT": "Blinds",
      "CLEANING & HANDOVER": "Handover",
    };
    return map[c] || c.replace(" WORKS", "").replace(" & ", "/");
  }

  function totals() {
    const sub = state.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    const discount = Math.min(Math.max(Number(state.customer.discount) || 0, 0), sub);
    const after = sub - discount;
    const vat = after * ratebook.vatRate;
    const net = after + vat;
    return { sub, discount, after, vat, net };
  }

  /* ---------- Navigation ---------- */
  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(`screen-${name}`).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.screen === name);
    });
    if (name === "catalog") renderCatalog();
    if (name === "quote") renderQuote();
    if (name === "customer") renderCustomer();
    if (name === "export") renderExport();
  }

  /* ---------- Customer ---------- */
  function renderCustomer() {
    const c = state.customer;
    document.getElementById("c-name").value = c.name;
    document.getElementById("c-phone").value = c.phone;
    document.getElementById("c-email").value = c.email;
    document.getElementById("c-project").value = c.project;
    document.getElementById("c-location").value = c.location;
    document.getElementById("c-notes").value = c.notes;
    document.getElementById("c-quoteNo").value = c.quoteNo;
    document.getElementById("c-date").value = c.date;
    document.getElementById("c-discount").value = c.discount || "";
  }

  function bindCustomer() {
    const map = {
      "c-name": "name",
      "c-phone": "phone",
      "c-email": "email",
      "c-project": "project",
      "c-location": "location",
      "c-notes": "notes",
      "c-quoteNo": "quoteNo",
      "c-date": "date",
      "c-discount": "discount",
    };
    Object.entries(map).forEach(([id, key]) => {
      document.getElementById(id).addEventListener("input", (e) => {
        state.customer[key] =
          key === "discount" ? Number(e.target.value) || 0 : e.target.value;
        save();
      });
    });
  }

  /* ---------- Catalog ---------- */
  function renderCatalog() {
    const chips = document.getElementById("chips");
    chips.innerHTML = categories()
      .map(
        (c) =>
          `<button class="chip ${state.filterCat === c ? "active" : ""}" data-cat="${c}">${
            c === "ALL" ? "All" : shortCat(c)
          }</button>`
      )
      .join("");

    chips.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filterCat = btn.dataset.cat;
        renderCatalog();
      });
    });

    const q = state.search.trim().toLowerCase();
    let items = ratebook.items;
    if (state.filterCat !== "ALL") {
      items = items.filter((i) => i.category === state.filterCat);
    }
    if (q) {
      items = items.filter(
        (i) =>
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          String(i.id) === q
      );
    }

    const list = document.getElementById("catalog-list");
    if (!items.length) {
      list.innerHTML = `<div class="empty">No items match your search.</div>`;
      return;
    }

    list.innerHTML = items
      .map(
        (i) => `
      <div class="item" data-id="${i.id}">
        <div class="cat">${i.category} · #${i.id}</div>
        <div class="desc">${escapeHtml(i.description)}</div>
        <div class="meta">
          <span>UOM: <strong>${i.uom}</strong></span>
          <span class="price">${fmt(i.unitPrice)} / ${i.uom}</span>
        </div>
        <div class="add-row">
          <input type="number" min="0" step="any" value="${i.defaultQty}" class="qty-input" aria-label="Quantity" />
          <button class="btn btn-primary add-btn">Add</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll(".item").forEach((el) => {
      el.querySelector(".add-btn").addEventListener("click", () => {
        const id = Number(el.dataset.id);
        const qty = Number(el.querySelector(".qty-input").value) || 0;
        if (qty <= 0) {
          toast("Enter a quantity greater than 0");
          return;
        }
        addLine(id, qty);
      });
    });
  }

  function addLine(itemId, qty) {
    const item = ratebook.items.find((i) => i.id === itemId);
    if (!item) return;
    const existing = state.lines.find((l) => l.itemId === itemId);
    if (existing) {
      existing.qty = Number(existing.qty) + Number(qty);
    } else {
      state.lines.push({
        uid: uid(),
        itemId: item.id,
        description: item.description,
        category: item.category,
        uom: item.uom,
        unitPrice: item.unitPrice,
        qty: Number(qty),
      });
    }
    save();
    toast("Added to quote");
    updateHomeStats();
  }

  /* ---------- Quote ---------- */
  function renderQuote() {
    const list = document.getElementById("quote-list");
    if (!state.lines.length) {
      list.innerHTML = `<div class="empty">No line items yet.<br/>Go to <strong>Rates</strong> and add BOQ items.</div>`;
      document.getElementById("quote-totals").innerHTML = "";
      return;
    }

    list.innerHTML = state.lines
      .map(
        (l) => `
      <div class="quote-line" data-uid="${l.uid}">
        <div class="top">
          <div class="desc"><span class="cat" style="display:block;margin-bottom:4px">${l.category}</span>${escapeHtml(
            l.description
          )}</div>
          <div class="total">${fmt(l.qty * l.unitPrice)}</div>
        </div>
        <div class="controls">
          <div>
            <label>Qty (${l.uom})</label>
            <input type="number" min="0" step="any" class="q-qty" value="${l.qty}" />
          </div>
          <div>
            <label>Rate (AED)</label>
            <input type="number" min="0" step="any" class="q-rate" value="${l.unitPrice}" />
          </div>
          <button class="btn btn-danger q-del">Remove</button>
        </div>
      </div>`
      )
      .join("");

    list.querySelectorAll(".quote-line").forEach((el) => {
      const line = state.lines.find((l) => l.uid === el.dataset.uid);
      el.querySelector(".q-qty").addEventListener("input", (e) => {
        line.qty = Number(e.target.value) || 0;
        save();
        el.querySelector(".total").textContent = fmt(line.qty * line.unitPrice);
        renderTotalsOnly();
        updateHomeStats();
      });
      el.querySelector(".q-rate").addEventListener("input", (e) => {
        line.unitPrice = Number(e.target.value) || 0;
        save();
        el.querySelector(".total").textContent = fmt(line.qty * line.unitPrice);
        renderTotalsOnly();
        updateHomeStats();
      });
      el.querySelector(".q-del").addEventListener("click", () => {
        state.lines = state.lines.filter((l) => l.uid !== line.uid);
        save();
        renderQuote();
        updateHomeStats();
        toast("Line removed");
      });
    });

    renderTotalsOnly();
  }

  function renderTotalsOnly() {
    const t = totals();
    document.getElementById("quote-totals").innerHTML = `
      <div class="totals">
        <div class="line"><span>Sub total</span><strong>${fmt(t.sub)}</strong></div>
        <div class="line"><span>Discount</span><strong>- ${fmt(t.discount)}</strong></div>
        <div class="line"><span>VAT (${(ratebook.vatRate * 100).toFixed(0)}%)</span><strong>${fmt(
          t.vat
        )}</strong></div>
        <div class="line grand"><span>Net total</span><span>${fmt(t.net)}</span></div>
      </div>`;
  }

  /* ---------- Export / Preview ---------- */
  function quotePayload() {
    const t = totals();
    return { customer: state.customer, lines: state.lines, totals: t, ratebook: ratebook.source };
  }

  function buildPrintHtml() {
    const { customer, lines } = state;
    const t = totals();
    const rows = lines
      .map(
        (l, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(l.category)}</td>
        <td>${escapeHtml(l.description)}</td>
        <td>${l.uom}</td>
        <td style="text-align:right">${l.qty}</td>
        <td style="text-align:right">${fmt(l.unitPrice)}</td>
        <td style="text-align:right">${fmt(l.qty * l.unitPrice)}</td>
      </tr>`
      )
      .join("");

    return `
      <div style="font-family:Segoe UI,Arial,sans-serif;color:#111">
        <h2 style="margin:0 0 4px">AstralForgeAE — QUOTATION</h2>
        <div style="color:#555;margin-bottom:12px">Prepared by Afsal · Rates: ${ratebook.source} · VAT ${(
          ratebook.vatRate * 100
        ).toFixed(0)}%</div>
        <table style="width:100%;border:none;margin-bottom:12px">
          <tr><td style="border:none;padding:2px"><b>Quote No:</b> ${escapeHtml(
            customer.quoteNo
          )}</td>
              <td style="border:none;padding:2px;text-align:right"><b>Date:</b> ${escapeHtml(
                customer.date
              )}</td></tr>
          <tr><td style="border:none;padding:2px"><b>Customer:</b> ${escapeHtml(
            customer.name || "—"
          )}</td>
              <td style="border:none;padding:2px;text-align:right"><b>Phone:</b> ${escapeHtml(
                customer.phone || "—"
              )}</td></tr>
          <tr><td style="border:none;padding:2px" colspan="2"><b>Project:</b> ${escapeHtml(
            customer.project || "—"
          )} · ${escapeHtml(customer.location || "")}</td></tr>
        </table>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Category</th><th>Description</th><th>UOM</th>
              <th>Qty</th><th>Unit Price</th><th>Total</th>
            </tr>
          </thead>
          <tbody>${rows || `<tr><td colspan="7">No items</td></tr>`}</tbody>
        </table>
        <div style="margin-top:12px;text-align:right">
          <div>Sub total: <b>${fmt(t.sub)}</b></div>
          <div>Discount: <b>- ${fmt(t.discount)}</b></div>
          <div>VAT: <b>${fmt(t.vat)}</b></div>
          <div style="font-size:1.15rem;margin-top:6px">Net total: <b>${fmt(t.net)}</b></div>
        </div>
        ${
          customer.notes
            ? `<p style="margin-top:14px"><b>Notes:</b> ${escapeHtml(customer.notes)}</p>`
            : ""
        }
        <p style="margin-top:18px;color:#666;font-size:0.85rem">Rates: ${escapeHtml(
          ratebook.source
        )}${
          ratebook.priceDate ? " (priced " + ratebook.priceDate + ")" : ""
        }. Indicative mid-range UAE fit-out rates. Validity subject to site survey, drawings and material final selection.</p>
      </div>`;
  }

  function renderExport() {
    const box = document.getElementById("preview-box");
    box.innerHTML = buildPrintHtml();
    const t = totals();
    document.getElementById("export-summary").textContent = `${state.lines.length} items · ${fmt(
      t.net
    )}`;
  }

  function printQuote() {
    const sheet = document.getElementById("printSheet");
    sheet.innerHTML = buildPrintHtml();
    window.print();
  }

  function shareQuote() {
    const t = totals();
    const c = state.customer;
    let text = `QUOTATION ${c.quoteNo}\nDate: ${c.date}\nCustomer: ${c.name || "—"}\nProject: ${
      c.project || "—"
    }\n\n`;
    state.lines.forEach((l, i) => {
      text += `${i + 1}. ${l.description.slice(0, 80)}…\n   ${l.qty} ${l.uom} × ${fmt(
        l.unitPrice
      )} = ${fmt(l.qty * l.unitPrice)}\n`;
    });
    text += `\nSubtotal: ${fmt(t.sub)}\nVAT: ${fmt(t.vat)}\nNET TOTAL: ${fmt(t.net)}\n`;

    if (navigator.share) {
      navigator
        .share({ title: `Quote ${c.quoteNo}`, text })
        .catch(() => copyText(text));
    } else {
      copyText(text);
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(
      () => toast("Quote copied to clipboard"),
      () => toast("Could not copy")
    );
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(quotePayload(), null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `${state.customer.quoteNo || "quote"}.json`);
  }

  function exportCsv() {
    const rows = [
      ["No", "Category", "Description", "UOM", "Qty", "Unit Price", "Total Price"],
      ...state.lines.map((l, i) => [
        i + 1,
        l.category,
        `"${l.description.replace(/"/g, '""')}"`,
        l.uom,
        l.qty,
        l.unitPrice,
        (l.qty * l.unitPrice).toFixed(2),
      ]),
    ];
    const t = totals();
    rows.push([]);
    rows.push(["", "", "", "", "", "Sub Total", t.sub.toFixed(2)]);
    rows.push(["", "", "", "", "", "Discount", t.discount.toFixed(2)]);
    rows.push(["", "", "", "", "", "VAT", t.vat.toFixed(2)]);
    rows.push(["", "", "", "", "", "Net Total", t.net.toFixed(2)]);
    const csv = rows.map((r) => r.join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), `${state.customer.quoteNo || "quote"}.csv`);
  }

  function downloadBlob(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Saved ${name}`);
  }

  function newQuote() {
    if (state.lines.length && !confirm("Start a new quote? Current lines will be cleared.")) return;
    state.lines = [];
    state.customer = {
      name: "",
      phone: "",
      email: "",
      project: "",
      location: "",
      notes: "",
      quoteNo: nextQuoteNo(),
      date: new Date().toISOString().slice(0, 10),
      discount: 0,
    };
    save();
    updateHomeStats();
    showScreen("customer");
    toast("New quote started");
  }

  function loadFullBoq() {
    if (
      !confirm(
        "Load the full fit-out rate book (all items with default sample quantities) into this quote?"
      )
    )
      return;
    state.lines = ratebook.items.map((item) => ({
      uid: uid(),
      itemId: item.id,
      description: item.description,
      category: item.category,
      uom: item.uom,
      unitPrice: item.unitPrice,
      qty: item.defaultQty,
    }));
    save();
    updateHomeStats();
    showScreen("quote");
    toast("Full fit-out schedule loaded");
  }

  /* ---------- Home ---------- */
  function updateHomeStats() {
    const t = totals();
    document.getElementById("stat-items").textContent = String(state.lines.length);
    document.getElementById("stat-total").textContent = fmt(t.net);
    document.getElementById("stat-rates").textContent = String(ratebook.items.length);
    document.getElementById("stat-quote").textContent = state.customer.quoteNo;
    const src = document.getElementById("rate-source");
    if (src) {
      src.textContent = `${ratebook.source}${
        ratebook.priceDate ? " · prices " + ratebook.priceDate : ""
      }`;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Init (called after staff login) ---------- */
  let started = false;

  function init() {
    if (started) return;
    started = true;
    load();
    bindCustomer();

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => showScreen(btn.dataset.screen));
    });

    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", (e) => {
        state.search = e.target.value;
        renderCatalog();
      });
    }

    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", fn);
    };
    bind("btn-new", newQuote);
    bind("btn-load-boq", loadFullBoq);
    bind("btn-print", printQuote);
    bind("btn-share", shareQuote);
    bind("btn-csv", exportCsv);
    bind("btn-json", exportJson);

    updateHomeStats();
    showScreen("home");
  }

  window.StaffQuoteApp = { init, showScreen };
})();

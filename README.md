# AstralForgeAE Website

Modern multi-page site for **AstralForgeAE** — shop drawings, advanced glass fabrication, **HVAC installation up to G+20**, **3D printing**, and custom solutions across the UAE.

**Live brand:** [linktr.ee/AstralForgeAE](https://linktr.ee/AstralForgeAE)

## Contacts

| Role | Contact | Link |
|------|---------|------|
| Email | info@astralforgeae.com | [mailto:info@astralforgeae.com](mailto:info@astralforgeae.com) |
| Projects / WhatsApp | +971 50 580 4276 | [wa.me/971505804276](https://wa.me/971505804276) |
| Technical Support | +971 50 836 4246 | [wa.me/971508364246](https://wa.me/971508364246) |

> **Note:** Update `info@astralforgeae.com` in `index.html` and `quote.html` if you use a different mailbox (e.g. Gmail now, custom domain later).

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Get a Quote | `quote.html` |

## Local preview

Open `index.html` in a browser, or:

```bash
npm run dev
```

Then visit `http://localhost:3000`.

## Deploy to Render (recommended)

### Option A — Static Site (easiest)

1. Push this folder to a GitHub repository.
2. Go to [dashboard.render.com](https://dashboard.render.com).
3. **New → Static Site**.
4. Connect the repo.
5. Settings:
   - **Build Command:** leave empty
   - **Publish Directory:** `.`
6. Create Static Site — Render will give you a free URL like  
   **`https://astralforgeweb.onrender.com`** (this is the live site today).

### Option B — Blueprint

1. Push to GitHub.
2. **New → Blueprint**.
3. Select the repo (uses `render.yaml`).

## Custom domain (own brand URL)

**Important:** Words like `yourdomain.com` in guides are **examples only**. That domain is owned by someone else — do **not** type it into a browser or DNS. Only use a domain **you bought**.

**Live site right now (no custom domain required):**  
https://astralforgeweb.onrender.com

### If a custom domain shows the wrong website

Usually DNS still points at an old host, parking page, or another Render service.

1. Open [dashboard.render.com](https://dashboard.render.com) → service **astralforgeweb** (or your static site name).
2. **Settings → Custom Domains** — add only the domain **you purchased** (e.g. `astralforgeae.com`).
3. Copy the exact DNS values Render shows (do not invent records).
4. At your **domain registrar** (where you bought the domain):
   - Remove old **A**, **CNAME**, and **URL redirect** records for `@` and `www`.
   - Add **only** the records Render lists.
5. Typical pattern:

   | Host | Type | Value |
   |------|------|--------|
   | `www` | CNAME | `astralforgeweb.onrender.com` (or the host Render shows) |
   | `@` (root) | A or ALIAS | IP / target **from Render** (not from random tutorials) |

6. Wait for DNS (minutes to 48h). In Render the domain should show **Verified** + HTTPS.
7. Test in a private/incognito window.

**Checks if it still looks wrong:**

- You opened the free Render URL by mistake vs the custom domain
- Domain is still on registrar **parking / “for sale”** page
- Cloudflare **proxy (orange cloud)** is on before the domain is verified — try DNS-only (grey cloud) first
- Domain was added to a **different** Render service

### 1. Buy a domain (only if you want a branded URL)

| Type | Examples |
|------|----------|
| International (`.com`, `.net`) | [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/), Namecheap, Porkbun |
| UAE (`.ae`) | [nic.ae](https://nic.ae/) accredited registrars |

Ideas: `astralforgeae.com`, `astralforge.ae`, `astralforge.consulting` — only after you confirm the name is free and **you** complete the purchase.

### 2. Professional email (after you own the domain)

| Option | Notes |
|--------|--------|
| **Google Workspace** | Paid Gmail for business |
| **Microsoft 365** | Outlook business mail |
| **Zoho Mail** | Free tier for custom domains |
| **Cloudflare Email Routing** | Free: forward `info@…` to your personal Gmail |

Until then, keep using WhatsApp / a personal Gmail, and update `info@astralforgeae.com` on the site when ready.

## Structure

```
├── index.html
├── quote.html
├── css/styles.css
├── js/main.js
├── assets/images/   # logo, hero, service art
├── assets/video/    # glass fabrication reel
├── render.yaml
└── package.json
```

## Social

- Instagram: [@astralforgeconsulting](https://www.instagram.com/astralforgeconsulting)
- Facebook: [AstralForgeAE](https://www.facebook.com/AstralForgeAE)
- X: [@Astralforgecons](https://x.com/Astralforgecons)

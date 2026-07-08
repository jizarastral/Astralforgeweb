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
6. Create Static Site — Render will give you a URL like `https://astralforge-web.onrender.com`.

### Option B — Blueprint

1. Push to GitHub.
2. **New → Blueprint**.
3. Select the repo (uses `render.yaml`).

## Custom domain (your own domain)

Yes — you can use your own domain (e.g. `astralforgeae.com` or `astralforge.ae`).

### 1. Buy a domain

Pick a registrar and purchase the name:

| Type | Examples |
|------|----------|
| International (`.com`, `.net`) | [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/), Namecheap, Google Domains alternatives (Squarespace), Porkbun |
| UAE (`.ae`) | [nic.ae](https://nic.ae/) accredited registrars (e.g. ae.domain, some local hosts) |

Suggested names: `astralforgeae.com`, `astralforge.ae`, `astralforge.consulting`.

Typical cost: ~$10–15/year for `.com`; `.ae` is usually higher.

### 2. Point the domain to Render

1. In **Render** → your static site → **Settings → Custom Domains** → add `astralforgeae.com` (and optionally `www`).
2. Render shows the DNS records you need (usually a **CNAME** for `www` and an **A/ALIAS** or CNAME for the root, depending on the registrar).
3. In your domain registrar’s **DNS** panel, add those records exactly.
4. Wait for DNS (often minutes, sometimes up to 24–48 hours). Render will issue a free HTTPS certificate.

### 3. Professional email on your domain

After you own the domain, set up mailboxes such as `info@astralforgeae.com`:

| Option | Notes |
|--------|--------|
| **Google Workspace** | Paid, polished Gmail interface |
| **Microsoft 365** | Outlook-style business mail |
| **Zoho Mail** | Free tier available for custom domains |
| **Cloudflare Email Routing** | Free: forward `info@…` to your personal Gmail |

Then update the email links on this site if needed.

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

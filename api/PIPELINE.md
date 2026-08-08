# AstralForge commercial pipeline

```
Website  →  Live AI demo  →  Lead capture  →  Azure backend  →  NVIDIA AI  →  Prospect  →  Payment
```

## Components

| Step | What | Where |
|------|------|--------|
| 1 Website | Conversion landing | `../index.html` (static / Render) |
| 2 Live AI demo | Chat UI + scripted intro | `js/ai-main.js` |
| 3 Lead capture | Form + WhatsApp notify | `POST /api/leads` + `lead-router.js` |
| 4 Azure backend | Node Express API | this `api/` folder → Azure App Service |
| 5 NVIDIA AI | Chat completions | `NVIDIA_API_KEY` → integrate.api.nvidia.com |
| 6 Business prospect | Stages CRM-lite | `POST/PATCH /api/prospects` |
| 7 Payment | Stripe Checkout (AED setup) | `POST /api/checkout/session` |

## Prospect stages

`new_lead` → `contacted` → `qualified` → `proposal_sent` → `payment_pending` → `paid` → `onboarding` (or `lost`)

## Local run

```bash
cd api
cp .env.example .env
# edit NVIDIA_API_KEY, STRIPE_SECRET_KEY, ADMIN_API_KEY
npm install
npm run dev
```

API: `http://127.0.0.1:8787/api/health`

Static site (another terminal):

```bash
cd ..
npx serve . -l 3000
```

Set in `index.html`:

```html
<meta name="af-api-base" content="http://127.0.0.1:8787" />
```

## Azure deploy (summary)

1. Create **Azure App Service** (Node 18 LTS) or **Container Apps**.
2. Deploy the `api/` folder (startup: `node src/server.js`).
3. App Settings (Configuration):
   - `NVIDIA_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `PUBLIC_SITE_URL` = your website URL
   - `CORS_ORIGINS` = website origin(s)
   - `ADMIN_API_KEY`
   - `LEAD_EMAIL` / `WHATSAPP_NOTIFY`
4. Stripe Dashboard → Webhook → `https://YOUR-APP.azurewebsites.net/api/checkout/webhook`  
   Event: `checkout.session.completed`
5. On the website, set:

```html
<meta name="af-api-base" content="https://YOUR-APP.azurewebsites.net" />
```

## NVIDIA key

1. https://build.nvidia.com  
2. Create API key  
3. Model default: `meta/llama-3.1-8b-instruct` (change via `NVIDIA_MODEL`)

Optional fallback: Azure OpenAI env vars in `.env.example`.

## Stripe AED packages

| Package | Setup (charged) | Monthly (after onboarding) |
|---------|-----------------|----------------------------|
| starter | AED 999 | AED 299 |
| business | AED 1,999 | AED 499 |

Checkout creates a **one-time setup** payment. Monthly retainer is handled after sales onboarding (not auto-subscribed unless you add Price IDs later).

## Admin list prospects

```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" https://YOUR-APP.azurewebsites.net/api/prospects
```

## Security

- Never put NVIDIA / Stripe / admin keys in frontend code.
- Demo rate-limited; lead form rate-limited.
- Data files under `api/data/` — use durable Azure Storage/SQL when you outgrow single-instance disk.

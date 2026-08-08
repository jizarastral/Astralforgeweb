# AstralForgeAE — project rules

## What this repo is

Static multi-page site for **AstralForgeAE** (UAE).

**Primary public brand (homepage):** **AstralForge AI** — AI employees / AI automation for UAE SMBs.  
Money-first goal: **qualified leads → demos → paid AI automation clients → MRR.**

**Also in repo (legacy / internal):** fabrication, shop drawings, glass, HVAC, fit-out quote tools, IT day rates — do not rebrand the homepage back to fabrication unless the user asks.

- **Live:** https://astralforgeweb.onrender.com  
- **GitHub:** https://github.com/jizarastral/Astralforgeweb  
- **Deploy:** push `main` → Render auto-deploy  
- **Stack:** HTML / CSS / JS. Dark navy `#050814`, cyan `#5ee7ff`, Outfit + JetBrains Mono.  
- **Homepage styles:** `css/ai-convert.css` · **scripts:** `js/ai-main.js` + `js/lead-router.js`

## Contacts (all three must stay visible)

| Role | Number | WhatsApp |
|------|--------|----------|
| **Sales** | **+971 55 445 8850** | https://wa.me/971554458850 |
| **Technical** | **+971 50 836 4246** | https://wa.me/971508364246 |
| **Client happiness** | **+971 50 580 4276** | https://wa.me/971505804276 |
| Email | astralfconsulting@gmail.com | mailto |

### Lead routing

- **Sales** leads → Sales number + **copy to Client happiness** + email  
- **Technical** leads → Technical number + **copy to Client happiness** + email  
- Forms use `js/lead-router.js`

## AI products (homepage)

1. AI Sales Employee  
2. AI Customer Service Employee  
3. AI Booking Employee  

Positioning: *AI employees for businesses that never want to miss another customer.*

## Technical fit-out quote tool (internal)

- **URL:** `/technical/`  
- **Access:** Afsal only (`js/technical-auth.js`).  
- Public quote form: `quote.html`  
- Rate book: `js/ratebook.js`  
- `noindex` on technical page — do not advertise password.

## Conventions

- Homepage = conversion for AI employees (not generic agency fluff).  
- Primary CTAs: **Get my AI employee** / **Try live demo**.  
- Quote form / WhatsApp → email + dual WhatsApp via lead-router.  
- Push `main` after user-facing changes.  
- Do not invent contacts.  

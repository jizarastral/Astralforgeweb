# AstralForgeAE — project rules

## What this repo is

Static multi-page marketing site for **AstralForgeAE** (UAE).

- **Live:** https://astralforgeweb.onrender.com  
- **GitHub:** https://github.com/jizarastral/Astralforgeweb  
- **Deploy:** push `main` → Render static site auto-deploy  
- **Stack:** plain HTML / CSS / JS (no framework). Style: dark navy `#050814`, cyan `#5ee7ff`, indigo/violet gradient, Outfit + JetBrains Mono.

## Business / services

1. Shop drawings (glass & façade, CAD coordination)  
2. Advanced glass fabrication support  
3. **HVAC installation** — residential & commercial, **up to G+20 floors**  
4. **3D printing** — prototypes, models, custom parts  
5. Custom technical solutions / consulting  

## Contacts (source of truth)

| Channel | Value |
|---------|--------|
| Email | **astralfconsulting@gmail.com** |
| Projects WhatsApp | +971 50 580 4276 → https://wa.me/971505804276 |
| Technical support | +971 50 836 4246 → https://wa.me/971508364246 |
| Instagram | https://www.instagram.com/astralforgeconsulting |
| Facebook | https://www.facebook.com/AstralForgeAE |
| X | https://x.com/Astralforgecons |
| Linktree | https://linktr.ee/AstralForgeAE |

Do **not** use `info@astralforgeae.com` or placeholder domains like `yourdomain.com`.

## Site structure

```
index.html      # home
quote.html      # quote form (WhatsApp + email submit)
css/styles.css
js/main.js
assets/images/  # logo, hero, service-*.jpg
assets/video/   # hero fabrication reel
render.yaml
```

Service images: `service-drawings.jpg`, `service-glass.jpg`, `service-hvac.jpg`, `service-print.jpg`.

## Coding conventions

- Match existing glassmorphism / cyan accent UI; reuse classes (`.btn`, `.service-card`, `.glass`, etc.).
- Prefer static solutions (no backend). Quote form opens WhatsApp or `mailto:`.
- Keep mobile nav + reveal animations working.
- After user-facing changes, commit and **push `main`** so Render publishes.
- Do not invent new emails, phones, or domains.

## Brand tone

Professional, precise, modern UAE engineering — not playful. Emphasize clarity, G+20 HVAC capacity, fabrication, and coordination.

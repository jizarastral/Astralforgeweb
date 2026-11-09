# ASTRAL FORGE — Teaser Launch Decision Record
Date: 2026-11-09 (Asia/Dubai)
Status: DRAFT PREVIEW ONLY. Do not deploy/merge without explicit approval.

## Decision
This is deliberately a two-layer site, not a feature catalogue.
- Landing page: "Designing the Future" and a controlled digital-infrastructure animation ("The Future is Loading").
- About page: the person behind the brand, the gaming-to-building transition and work done under real constraints.
- Brand first, founder second, product details private until a verified launch.

## What NOT to publish
- Product names, unreleased features/screenshots, agent architecture, exact task list, code excerpts, technical competitive details, unverified metrics, private setbacks, unapproved portrait, customer data or API credentials.
- Do not imply products are available or security-audited before independently verified.
- Do not add autoplay sound, a blocking intro, a deceptive progress percentage or a forced countdown.

## First-reveal date
Proposed: 20 January 2027. This is a **brand story / first reveal target**, not a promise to release products by that date.
Product release announcement requires functional + security release gates to pass first.
Before publishing the date, confirm internal capacity, release-day content, supporting assets and ownership.

## Editorial validation before launch
- Verify every founder biography statement in conversation with Astral. Real name and photo require explicit publication consent.
- Do not invent number of products shipped, dates of personal milestones or reasons for leaving gaming.
- Site currently contains an editorial founder draft; adjust to the real story before merge.
- Check email routing: the current CTA opens the verified existing astralfconsulting@gmail.com address but does not store leads automatically.
- Add privacy policy and compliant opt-in mechanism before collecting email addresses or enabling ad pixels.

## Creative direction
- 70% editorial minimalism, 30% cinematic technology.
- Hero animation shows tiny light data nodes that assemble into a growing infrastructure network.
- No flashing, no forced loading delay, no autoplay sound.
- Respect reduced motion; small payload; accessible HTML/contrast and keyboard navigation.
- For social: a separately edited dramatic 8–12 s trailer sharing the same visual identity.

## Marketing approach / JustAd
1. Site QA and instrument only privacy-compliant conversion events before buying traffic.
2. Invite JustAd to propose an **audience/creative test**, not a broad campaign: UAE-first founders/builders, then international segments if proven.
3. Ask for written platform spend, account ownership, analytics access, fee schedule, creative rights, attribution and exit criteria.
4. Test budget proposal AED 1,500–3,000 only after site ready (not a vendor quote).
5. Measure useful leads, opt-in rate, follow-up engagement, not impressions alone. Stop if conversion quality is poor.

## Deployment gates
- [ ] Confirm personal/about-page facts and disclosure consent
- [ ] Confirm whether January 20 should be displayed publicly
- [ ] Verify all links, responsive layout, motion accessibility and performance
- [ ] Confirm privacy/contact policy and no third-party trackers by default
- [ ] Review current site DNS/deployment and ensure a rollback path
- [ ] Product claims reviewed; no implied released products
- [ ] Explicit approve to merge and deploy to astralforgeae.com

## Build notes
Static HTML/CSS/JS in `out/`. Motion is CSS + Canvas, no video runtime or user tracking. No secrets required.
Do not overwrite main or change the Render deployment until accepted.

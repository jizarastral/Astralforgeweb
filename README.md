# AstralForge AE

Simple Astral chat for https://astralforgeae.com

## Render

This must be a **Node web service**, not a static site.

- Build: `corepack enable && pnpm install && pnpm build`
- Start: `pnpm start`
- Env: `NVIDIA_API_KEY` (required for live chat). Optional: Azure, xAI, OpenRouter, Groq, OpenAI, Gemini.

Do not commit `.env.local`.

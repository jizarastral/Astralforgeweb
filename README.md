# AstralForge AE

Simple Astral chat for https://astralforgeae.com

## Render

This must be a **Node web service**, not a static site.

- Build: `npm install && npm run build`
- Start: `npm start`
- **Port:** leave Render’s default. Do not type 3000. The app reads `$PORT` (usually 10000).
- Env: `NVIDIA_API_KEY` (required for live chat). Optional: Azure, xAI, OpenRouter, Groq, OpenAI, Gemini.

Do not commit `.env.local`.

# Devscout-UI

An AI-powered developer learning platform that helps you learn while you build through evidence-backed research, concept explanations, guided project work, understanding checks, and readiness-based code assistance.

## Run locally

```bash
npm install
npm run generate:types
npm run dev
```

The frontend only calls `VITE_API_BASE_URL` (defaulting to `http://localhost:8000`) and never calls an AI provider directly. Set `VITE_USE_MOCK=true` to use the included evidence-backed demo response. Mock behavior can be selected with `VITE_MOCK_SCENARIO`: `happy_path`, `insufficient_evidence`, `quota_exceeded`, `fallback_questions`, or `failed_job`.

Generate `src/types/api.d.ts` from the running backend with `npm run generate:types`. The frontend sends `X-API-Key` from `VITE_API_KEY` when configured for local development. Do not expose that key in production; use a server-side proxy.

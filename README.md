# Devscout-UI
An AI-powered developer learning platform that helps you learn while you build through evidence-backed research, concept explanations, guided project work, understanding checks, and readiness-based code assistance.

## Run locally

```bash
npm install
npm run generate:types
npm run dev
```

The frontend only calls `VITE_API_BASE_URL` (defaulting to `http://localhost:8000`) and never calls an AI provider directly. Set `VITE_USE_MOCK=true` to use the included evidence-backed demo response.

The OpenAPI source of truth is [`openapi.yaml`](./openapi.yaml); `src/types/api.d.ts` is generated from it with `openapi-typescript`.

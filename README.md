# DEVSCOUT UI

**DEVSCOUT: Learn While You Build**

DEVSCOUT UI is a React and TypeScript frontend for an evidence-backed developer
learning companion. It guides a learner from a development goal through a
learning plan, research, explanations, concept mapping, understanding checks,
and readiness-based code assistance.

The backend is maintained in
[DEVSCOUT-V2](https://github.com/notujjwal-kiet/DEVSCOUT-V2).

> **Integration status:** The frontend has an explicit mock/demo mode and a
> typed live API client. Mock output must not be presented as live research or
> live model output. Live mode requires the backend endpoints listed below to
> be registered, reachable, and tested.

## Learner journey

1. Describe a development goal, project context, experience level, and stack.
2. Receive a structured learning plan.
3. Review research sources, provenance, freshness, reliability, and uncertainty.
4. Learn concepts through cited explanations and a concept map.
5. Complete an understanding check.
6. Request code assistance when the backend readiness policy permits it.
7. Review progress, metrics, warnings, and next steps.

## Technology

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Vitest and Testing Library
- ESLint and Prettier

## Requirements

- Node.js and npm versions compatible with `package.json`
- The DEVSCOUT-V2 backend for live mode

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

The default demo configuration is:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=true
VITE_MOCK_SCENARIO=happy_path
VITE_API_KEY=
```

### 3. Start the frontend

```bash
npm run dev
```

Vite provides hot-module replacement. Nodemon is not required for the
frontend.

### 4. Start the backend for live mode

From the backend repository, activate its virtual environment and run:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Then set the following in the frontend `.env` and restart Vite:

```dotenv
VITE_USE_MOCK=false
```

Before calling the integration live, verify `/health` and every learning
endpoint in the backend's generated OpenAPI document. A successful frontend
build does not prove that the backend routes are available.

## Environment variables

| Variable             | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`  | Base URL of the FastAPI backend. Defaults to `http://localhost:8000`.                  |
| `VITE_USE_MOCK`      | Set to `true` for explicit demo mode; set to `false` for live API requests.            |
| `VITE_MOCK_SCENARIO` | Mock scenario to display when mock mode is enabled.                                    |
| `VITE_API_KEY`       | Optional development `X-API-Key` header. Do not use this as production API protection. |

Supported mock scenarios:

- `happy_path`
- `insufficient_evidence`
- `quota_exceeded`
- `fallback_questions`
- `failed_job`

The UI visibly labels mock/demo mode. It does not silently switch to mock mode
when a live request fails.

## API contract

The frontend client currently integrates with these backend routes:

| Method | Endpoint              | Purpose                                                 |
| ------ | --------------------- | ------------------------------------------------------- |
| `GET`  | `/health`             | Backend connectivity and health status                  |
| `POST` | `/api/learn`          | Start an asynchronous learning job                      |
| `GET`  | `/api/learn/{job_id}` | Poll job status and the eventual result                 |
| `POST` | `/api/code-request`   | Submit understanding answers or request code assistance |
| `GET`  | `/api/quota`          | Read quota and usage information                        |
| `GET`  | `/api/models`         | Read available backend model options                    |

Learning jobs use the backend's asynchronous status contract:

- `pending`
- `running`
- `completed`
- `failed`
- `timed_out`

The frontend polls with chained timers, stops on terminal states, bounds
transient retries, and honors `Retry-After` for HTTP 429 responses.

Generated API types live in
[`src/types/api.d.ts`](./src/types/api.d.ts). Regenerate them only after the
backend is running and its OpenAPI schema is available:

```bash
npm run generate:types
```

Keep the backend's OpenAPI schema, registered routes, response models, and
frontend client synchronized. Generated types alone do not prove that an
endpoint is registered or reachable.

## API key safety

Every `VITE_*` variable is embedded in the browser bundle and is therefore
public. Never put Gemini, Groq, Cerebras, or any other provider secret in a
frontend environment variable. Keep provider credentials in the backend
environment.

`VITE_API_KEY` is provided only for development scenarios where the backend
requires an `X-API-Key` header. Production deployments should use server-side
authentication or a trusted proxy instead of exposing an API key in the
frontend.

## Quality checks

Run the full local checks before demonstrating or deploying the UI:

```bash
npm run build
npm test
npm run lint
```

Optional formatting:

```bash
npm run format
```

Tests cover the learning-job lifecycle, polling retries, cancellation and
stale-result protection, evidence states, code-gate behavior, error handling,
and mock/demo presentation.

## Project structure

```text
src/
├── api/          # Typed API client and explicit mock service
├── app/          # Routing, providers, and shared job state
├── components/   # Layout and reusable UI components
├── features/     # Goal, pipeline, plan, sources, explanation, map, and gate screens
├── services/     # Learning-job lifecycle and polling
├── styles/       # Global styles and design tokens
└── types/        # Generated OpenAPI TypeScript types
```

## Demo and integration checklist

- Confirm the frontend starts with `npm run dev`.
- Use mock mode for UI demos when the backend is unavailable.
- Confirm the UI says **Mock mode** before treating displayed data as demo data.
- For live mode, verify `/health`, `/api/learn`, job polling, `/api/code-request`,
  `/api/quota`, and `/api/models` against the running backend.
- Test loading, cancellation, retry, 404/job-expired, rate-limit, timeout,
  insufficient-evidence, and code-gate states.
- Do not claim live provider integration until a real backend request succeeds.

## Related repository

- Backend:
  [notujjwal-kiet/DEVSCOUT-V2](https://github.com/notujjwal-kiet/DEVSCOUT-V2)

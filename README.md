DEVSCOUT UI
DEVSCOUT: Learn While You Build.

The React + TypeScript frontend for DEVSCOUT, an AI-assisted developer learning platform for research-backed explanations, guided project work, understanding checks, and readiness-based code assistance.

The FastAPI backend is maintained at DEVSCOUT-V2.
Integration status: The UI has an explicit mock/demo mode. Its API client expects several learning endpoints, but live mode works only after those endpoints are registered and tested in the backend. A successful frontend build alone does not prove backend integration.

Intended learner journey
1. Describe a development goal and current skill level.
2. Receive a structured learning plan.
3. Explore research and relevant sources.
4. Learn the concepts behind the implementation.
5. Work through a guided project.
6. Complete an understanding check.
7. Request code assistance when permitted by the readiness policy.
8. Review progress and next steps.
Clearly distinguish sourced resources, generated explanations, mock content, and live backend results.
Stack
- React 18, TypeScript, Vite
- React Router
- Vitest and Testing Library
- ESLint and Prettier
Run locally
Requirements: Node.js/npm compatible with package.json. The backend is needed for live mode.
1. Install dependencies
npm install
2. Configure environment
Copy .env.example to .env.

PowerShell:
Copy-Item .env.example .env
macOS/Linux:
cp .env.example .env
Default demo configuration:
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=true
VITE_MOCK_SCENARIO=happy_path
VITE_API_KEY=
3. Start frontend
npm run dev
Vite already provides hot-module replacement. Nodemon is not needed for the frontend.
4. Start backend for live mode
In a second terminal, activate the backend virtual environment and run from the backend repository:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
Set VITE_USE_MOCK=false in the frontend .env and restart Vite if needed. The inspected backend main branch currently registers only GET /health; live learning remains incomplete until the required learning endpoints are implemented and verified.
Environment variables
Variable	Purpose
VITE_API_BASE_URL	FastAPI backend base URL
VITE_USE_MOCK	true uses demo behavior; false calls the backend
VITE_MOCK_SCENARIO	Chooses a supported mock scenario
VITE_API_KEY	Development-only X-API-Key header if required by the backend


Known mock scenarios: happy_path, insufficient_evidence, quota_exceeded, fallback_questions, failed_job.

Mock mode is useful for UI demos without consuming model-provider quota. Do not present mock output as a live AI result.
API key safety
Every VITE_* variable is browser-visible in the built frontend. Never put Gemini, Groq, Cerebras, or other model-provider secrets in frontend variables. Keep those keys in the backend environment. The optional frontend VITE_API_KEY is not suitable for protecting a public production API; use proper server-side authentication or a trusted proxy.
Expected API contract
The current frontend client expects these routes:
Method	Endpoint	Purpose
GET	/health	Backend connectivity
POST	/api/learn	Start a learning job
GET	/api/learn/{jobId}	Poll job status/result
POST	/api/code-request	Request code assistance
GET	/api/quota	Usage/quota information
GET	/api/models	Configured model options


Types are in src/types/api.d.ts. After the backend OpenAPI contract is updated and the API is running, regenerate them with:
npm run generate:types
Generated types do not prove an endpoint exists. Keep the OpenAPI schema, registered backend routes, and frontend client aligned.
Quality checks
npm run build
npm test
npm run lint
Optional formatting:
npm run format
Run checks before the demo and report failures honestly.
Project structure
src/
├── api/          # Typed API client and mock responses
├── app/          # Shared app providers and state
├── services/     # Learning job lifecycle and polling
├── types/        # Generated API types
└── ...           # UI components and routes
Demo checklist
- Confirm the UI starts with npm run dev.
- Use mock mode if live learning endpoints are not ready.
- For live mode, verify /health and each required endpoint against the running backend.
- Check loading, failure, rate-limit, and fallback states.
- Keep provider keys out of browser code.
- Claim live provider integration only after a real request succeeds.
Related repository
- Backend: notujjwal-kiet/DEVSCOUT-V2
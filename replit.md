# African Cyber Shield

Africa's cybersecurity toolkit — phishing URL scanner, password strength checker, 2FA setup guide, and scan history with OWASP Top 10 severity mapping.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — used for session security (set in secrets)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + pino structured logging
- Auth: Replit Auth (OIDC/PKCE via `openid-client` v6) — sessions stored in PostgreSQL
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, React Query, wouter

## Where things live

- DB schema: `lib/db/src/schema/` — `scans.ts` + `auth.ts` (sessions + users)
- API contract: `lib/api-spec/openapi.yaml` (source of truth)
- Generated types: `lib/api-zod/` (Zod), `lib/api-client-react/` (React Query hooks)
- Auth lib (browser): `lib/replit-auth-web/` — `useAuth()` hook
- Phishing detector: `artifacts/api-server/src/lib/phishing-detector.ts`
- Dashboard routes: `/`=landing, `/analyzer`, `/batch`, `/history`, `/password`, `/2fa`, `/about`, `/contact`, `/terms`, `/privacy`
- PWA manifest: `artifacts/dashboard/public/manifest.json`

## Architecture decisions

- OWASP Top 10 (2021) categories are mapped dynamically at analysis time — not stored in DB, computed fresh per request
- Auth uses Replit OIDC (no custom login forms). The `lib/replit-auth-web` lib wraps `GET /api/auth/user` and provides `useAuth()` for the dashboard
- Sessions are stored in PostgreSQL (`sessions` table) with 7-day TTL — no Redis needed
- Cookie-parser + authMiddleware are mounted before all routes in `app.ts`
- `owaspCategories` field is in the API response but NOT in `scansTable` (derived at scan time only)
- Do NOT use generated API client code for auth operations — use `@workspace/replit-auth-web`

## Product

- **URL Analyzer**: Single URL phishing scan with heuristic scoring (0-100), risk level (LOW/MEDIUM/HIGH/CRITICAL), detection flags, and OWASP Top 10 category mapping
- **Batch Scanner**: Up to 20 URLs at once with CSV export
- **Scan History**: All past scans with filter and CSV export
- **Password Checker**: Entropy-based strength scoring with detailed feedback
- **2FA Setup Guide**: Step-by-step authentication hardening walkthrough
- **Auth**: Log in / log out via Replit OIDC — login button in sidebar footer
- **PWA**: Installable on mobile via `public/manifest.json`
- **Pages**: Terms of Service, Privacy Policy, Contact (mailto form), improved About with GitHub/LinkedIn

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml` — it rebuilds both the Zod schemas and React Query hooks
- Always run `pnpm --filter @workspace/db run push` after adding DB schema tables
- The `import.meta.env` reference in `lib/replit-auth-web/src/use-auth.ts` uses `(import.meta as any).env` to avoid a TypeScript error (vite is not a devDep of that lib)
- `tsconfig.json` (root) lists only composite libs — do NOT add artifact packages to it
- Auth routes are mounted at `/api` (e.g. `/api/login`, `/api/callback`, `/api/logout`, `/api/auth/user`)
- `SESSION_SECRET` env var must be set (use Replit Secrets)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `replit-auth` skill for auth flow details and token exchange

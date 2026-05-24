# African Cyber Shield

> Africa's purpose-built cybersecurity toolkit — phishing URL detection, password auditing, 2FA setup guides, and scan history with OWASP Top 10 severity mapping.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-brightgreen.svg)](https://nodejs.org/)

---

## What It Does

African Cyber Shield is a free, open-source security toolkit built for the African cyber threat landscape. It runs fully in-browser — no plugins, no tracking — and focuses on threats that matter most to African users: M-PESA phishing, fake bank portals, SIM-swap fraud, and weak mobile PINs.

| Tool | What it catches |
|---|---|
| **URL Analyzer** | Brand impersonation, typosquatting, suspicious TLDs (.ml, .tk, .xyz), redirect chains, raw-IP hosting |
| **Batch Scanner** | Up to 20 URLs at once — paste a list, export results as CSV |
| **Password Checker** | Entropy scoring, crack-time estimate, 200+ African-specific weak passwords blocked |
| **2FA Setup Guide** | Step-by-step guides for 17 African banks & mobile money platforms |
| **Scan History** | All past scans with OWASP Top 10 category breakdown and CSV export |

---

## Key Features

- **14 heuristic checks per URL** — structural, lexical, and entropy-based analysis with no blocklist lookups
- **OWASP Top 10 (2021) mapping** — every flag maps to a specific OWASP category (A01–A10)
- **< 80 ms average scan time** — fully serverside, no third-party API roundtrips
- **African brand monitoring** — 60+ institutions including M-PESA, MTN MoMo, GTBank, Ecobank, KCB, Equity, FNB, Capitec, UBA, Absa, Standard Bank, Zenith, Access Bank, and more
- **2FA guides for 17 platforms** — M-PESA, MTN MoMo, Airtel Money, KCB, Equity, GTBank, Zenith, FNB, Absa, Standard Bank, Capitec, Nedbank, Access Bank, Ecobank, UBA, Orange Money, plus authenticator app recommendations
- **Replit Auth** — sign in with your Replit account; scan history is persisted per user
- **PWA-ready** — installable on Android and iOS from the browser

---

## Screenshots

> Coming soon — contributions welcome.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24, TypeScript 5.9 |
| API | Express 5, pino structured logging |
| Auth | Replit Auth (OIDC/PKCE via `openid-client` v6) |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4, `drizzle-zod` |
| API contract | OpenAPI 3.1 → Orval codegen (Zod schemas + React Query hooks) |
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui, wouter |
| Build | esbuild (CJS bundle for the API server) |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
african-cyber-shield/
├── artifacts/
│   ├── api-server/          # Express API (port 8080)
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── phishing-detector.ts   # Core URL analysis engine
│   │       │   └── password-checker.ts    # Entropy scoring + Africa-specific blocklist
│   │       └── routes/                    # REST endpoints
│   └── dashboard/           # React + Vite frontend
│       └── src/
│           └── pages/       # analyzer, batch, history, password, 2fa, about, contact
├── lib/
│   ├── api-spec/            # openapi.yaml (source of truth for the API contract)
│   ├── api-zod/             # Generated Zod schemas (do not edit)
│   ├── api-client-react/    # Generated React Query hooks (do not edit)
│   ├── db/                  # Drizzle schema: scans + sessions + users
│   └── replit-auth-web/     # useAuth() hook for the frontend
└── scripts/                 # Shared utility scripts
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 9+
- PostgreSQL database

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret used to sign session cookies (32+ random chars) |

### Install & Run

```bash
# Install dependencies
pnpm install

# Push the database schema
pnpm --filter @workspace/db run push

# Start the API server (port 8080)
pnpm --filter @workspace/api-server run dev

# In another terminal — start the frontend (reads PORT from env)
pnpm --filter @workspace/dashboard run dev
```

### Regenerate API client after OpenAPI changes

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Full typecheck

```bash
pnpm run typecheck
```

---

## How the Phishing Detector Works

Every URL is scored 0–100 using a weighted heuristic engine. No blocklists. No third-party API calls. Everything is computed locally in under 80 ms.

**Checks include:**

1. Domain entropy (random-looking character sequences)
2. Brand name impersonation via substring matching (60+ African brands)
3. Typosquatting detection (Levenshtein distance on brand names)
4. Suspicious TLDs: `.ml`, `.tk`, `.xyz`, `.top`, `.click`, `.gq`, `.cf`, `.ga`
5. Raw IP address as hostname
6. URL shortener detection
7. Open redirect parameter patterns (`?url=`, `?redirect=`, `?next=`)
8. Deceptive path keywords (`/login`, `/verify`, `/update`, `/confirm`, `/secure`)
9. Excessive subdomains (3+)
10. Hyphen density in domain
11. Numeric substitution in brand names (`equ1ty`, `g00gle`)
12. Non-ASCII / IDN homograph characters
13. Extremely long URLs (> 100 characters)
14. Mismatched protocol vs. path (HTTPS URL with HTTP redirect keywords)

**Risk levels:**

| Score | Level | Action |
|---|---|---|
| 0–24 | LOW | Likely safe |
| 25–49 | MEDIUM | Proceed with caution |
| 50–74 | HIGH | Avoid — likely malicious |
| 75–100 | CRITICAL | Block — confirmed phishing pattern |

Every triggered flag is mapped to an **OWASP Top 10 (2021)** category for compliance and reporting purposes.

---

## API Reference

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scan` | Analyze a single URL |
| `POST` | `/api/scan/batch` | Analyze up to 20 URLs |
| `GET` | `/api/scans` | List scan history (authenticated) |
| `POST` | `/api/password/check` | Check password strength |
| `GET` | `/api/healthz` | Health check |
| `GET` | `/api/auth/user` | Current user (Replit Auth) |
| `GET` | `/api/login` | Initiate OIDC login |
| `GET` | `/api/logout` | Log out |

Full OpenAPI specification: [`lib/api-spec/openapi.yaml`](lib/api-spec/openapi.yaml)

---

## Contributing

Contributions are welcome and especially encouraged for:

- **New African institutions** — add 2FA guides for banks and telcos not yet covered
- **New phishing patterns** — if you encounter a new attack vector targeting African users, open an issue
- **African language support** — help localise the UI into Swahili, Hausa, Amharic, Zulu, French, or Portuguese
- **False positive reports** — if a legitimate URL is flagged incorrectly, please report it

### Adding a new 2FA platform

1. Edit `artifacts/dashboard/src/pages/two-factor.tsx`
2. Add an entry to the `PLATFORMS` array with `name`, `category`, `country`, `twoFAType`, `steps`, and `tip`
3. Open a pull request

### Reporting bugs & vulnerabilities

- **Bugs / feature requests:** [Open a GitHub Issue](https://github.com/codexmadzinga-blip/african-cyber-shield/issues/new)
- **Security vulnerabilities:** Email [security@africancybershield.dev](mailto:security@africancybershield.dev) — do not post publicly before disclosure

---

## Roadmap

- [ ] Swahili and Hausa UI localisation
- [ ] Browser extension for real-time URL checking
- [ ] Webhook alerts for enterprise users
- [ ] Community threat intelligence feed (African-specific IOCs)
- [ ] Mobile app (React Native / Expo)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">Built to protect Africa's digital future.</p>

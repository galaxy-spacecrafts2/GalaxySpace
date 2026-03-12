# Galaxy SpaceCrafts

Rocket telemetry and mission control system built with Next.js 16 (App Router).

## Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: better-auth (email/password) + in-memory QR session auth
- **Database**: Supabase (via `@supabase/ssr`)
- **State**: Redux Toolkit + Zustand
- **Animations**: Framer Motion
- **UI**: Radix UI primitives + shadcn/ui components

## Running

```bash
npm run dev   # starts on port 5000
```

## Architecture

### Auth Pages
- `/auth/login` — email/password + QR code login (desktop shows QR, mobile scans it)
- `/auth/sign-up` — registration with password strength indicator
- `/auth/qr-scan` — mobile camera scanner page
- `/auth/qr-confirm` — confirmation page opened on mobile after scanning

### Auth API Routes
- `POST /api/auth/qr/generate` — generates a QR session and returns `authUrl` for the QR code
- `GET  /api/auth/qr/check`    — polls QR session status from the desktop
- `POST /api/auth/qr/confirm`  — mobile confirms/denies the QR login

### Shared QR Session Store
`lib/store/qr-sessions.ts` — global in-memory Map (persists across hot-reloads via `global.__qrSessions`).
In production, replace with Redis.

### Supabase Clients
- Server: `utils/supabase/server.ts` — async `createClient()` using `@supabase/ssr` + Next.js cookies
- Browser: `utils/supabase/client.ts` — `createClient()` using `createBrowserClient`
- Middleware: `utils/supabase/middleware.ts` — for auth middleware integration

### Security Middleware (`middleware.ts`)
- Rate limiting (in-memory, 100 req/15min per IP)
- SQL injection and XSS pattern detection
- CSP headers configured for Replit domains + Supabase
- CORS restricted to `*.replit.dev`, `*.repl.co`, `*.replit.app`

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/publishable key |
| `BETTER_AUTH_SECRET` | Secret for better-auth sessions (min 32 chars) |
| `BETTER_AUTH_URL` | Public URL of the app |

## Replit Notes

- Port: **5000** (required for Replit webview)
- Host: **0.0.0.0** (required for Replit proxy)
- CORS and CSP configured for `*.replit.dev` and `*.repl.co` domains
- `optimizeCss` disabled (requires `critters` package not available)

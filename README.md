# NeoXFortress AI Intake + Risk Triage

Governance-first AI intake and deterministic risk triage web application aligned to **NIST AI RMF** (Govern, Map, Measure, Manage).

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/<YOUR_GITHUB_USERNAME>/neoxfortress-ai-intake&project-name=neoxfortress-ai-intake&repository-name=neoxfortress-ai-intake&env=DATABASE_URL,DEMO_PASSWORD,SESSION_SECRET)

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + lightweight shadcn-style primitives
- Prisma ORM + PostgreSQL (Neon-ready)
- Zod + React Hook Form

## Application Routes
- `/new` — 4-step intake wizard with autosave
- `/submissions` — searchable/filterable submissions list
- `/submissions/[id]` — triage summary + print/export PDF (`window.print()`)
- `/admin/rules` — read-only scoring rubric
- `/login` — shared-password demo authentication

## Required Environment Variables
Create a local `.env` from `.env.example` and set:

- `DATABASE_URL` — Neon/Postgres connection string
- `DEMO_PASSWORD` — shared password for demo access
- `SESSION_SECRET` — long random secret for session hashing

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env vars:
   ```bash
   cp .env.example .env
   ```
3. Generate client, run migrations, and seed data:
   ```bash
   npm run db:setup
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Neon Setup (Postgres)
1. Create a free Neon project at https://neon.tech.
2. Create/select a database.
3. Copy the pooled connection string.
4. Set it as `DATABASE_URL` in `.env` (local) and Vercel (cloud).
5. Run:
   ```bash
   npm run db:setup
   ```

## Deploy on Vercel (1-click)
1. Fork/push this project to a repo named **`neoxfortress-ai-intake`**.
2. Click the **Deploy to Vercel** button above.
3. In Vercel, set env vars:
   - `DATABASE_URL`
   - `DEMO_PASSWORD`
   - `SESSION_SECRET`
4. Deploy. Build runs `npm run vercel-build`, which executes Prisma generate + migrate deploy + Next build.
5. Verify:
   - `/login` loads and accepts demo password.
   - `/submissions` renders seeded or created entries.

### Preview vs Production Notes
- **Preview deployments**: use a preview Neon database or branch database URL.
- **Production deployment**: use a dedicated production Neon database URL.
- Migrations are applied safely using `prisma migrate deploy` at build time.

## NPM Scripts
- `npm run db:setup` → `prisma generate && prisma migrate dev && prisma db seed`
- `npm run db:migrate:deploy` → `prisma generate && prisma migrate deploy`
- `npm run vercel-build` → deploy-safe DB migration + Next build

## Deployment Checklist
- [ ] `DATABASE_URL` set
- [ ] `DEMO_PASSWORD` set
- [ ] `SESSION_SECRET` set
- [ ] Deployment succeeds
- [ ] `/login` works
- [ ] `/submissions` works

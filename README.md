# NeoXFortress AI Intake + Risk Triage

Production-style Next.js app for structured AI intake and deterministic risk triage aligned to NIST AI RMF (Govern, Map, Measure, Manage).

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + lightweight shadcn-style UI components
- Prisma ORM + SQLite
- Zod + React Hook Form

## Routes
- `/new` multi-step intake wizard with autosave
- `/submissions` searchable/filterable submissions list
- `/submissions/[id]` triage summary + print/export PDF
- `/admin/rules` read-only scoring rubric
- `/login` shared-password demo authentication

## Setup
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migration and seed:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```
4. Start app:
   ```bash
   npm run dev
   ```

## Tests
```bash
npm test
```

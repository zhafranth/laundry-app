# LaundryKu

> **"Kelola Cerdas, Untung Lebih"**
> SaaS web dashboard manajemen laundry untuk UMKM Indonesia.

---

## Monorepo Structure

```
laundry-app/
  frontend/       — Dashboard SPA (Vite + React + React Router v7)
  landing-page/   — Marketing site (Next.js)
  backend/        — API server (NestJS) [coming soon]
  docs/           — Documentation & planning
```

## Apps

| App | Tech | Deploy |
|---|---|---|
| `frontend/` | Vite + React 19 + TailwindCSS v4 | Vercel |
| `landing-page/` | Next.js | Vercel |
| `backend/` | NestJS + PostgreSQL | VPS |

## Quick Start

```bash
# Dashboard
cd frontend && npm install && npm run dev

# Landing page
cd landing-page && npm install && npm run dev
```

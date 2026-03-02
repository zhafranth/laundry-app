# LaundryKu — CLAUDE.md

> Project-level instructions for Claude Code. Dibaca otomatis setiap sesi.

---

## Project Overview

**LaundryKu** — SaaS web dashboard manajemen laundry untuk UMKM Indonesia
**Tagline:** "Kelola Cerdas, Untung Lebih"
**Status:** MVP 1 — In Development
**Working Dir:** `/Users/zhafrantharif/Documents/Others Project/laundry-app`

---

## Monorepo Structure

```
laundry-app/
  frontend/       ← Dashboard SPA (Vite + React + React Router v7)
  docs/           ← Docs & plans
  memory/         ← Claude persistent memory
  PRD-LaundryKu-MVP1.md
  DATABASE-LaundryKu-MVP1.md
  design-system-v2.jsx
```

> Landing page (marketing/kompro) akan dibuat terpisah menggunakan Next.js di masa depan.

---

## Tech Stack — Backend

| Layer | Tech |
|---|---|
| Framework | **NestJS** (Node.js) |
| Database | PostgreSQL (22 tables) |
| Auth | JWT (access + refresh token), bcrypt |
| Payment | Midtrans / Xendit |
| Hosting | VPS (DigitalOcean / IDCloudHost) |

---

## Tech Stack — Frontend Dashboard (`frontend/`)

| Layer | Tech |
|---|---|
| Bundler | **Vite** (bukan Next.js — dashboard tidak butuh SSR/SEO) |
| Framework | React 19 |
| Routing | **React Router v7 — library mode** (`createBrowserRouter`) |
| Styling | Tailwind CSS v4 (config via `@theme` di `globals.css`) |
| State | Zustand (auth + outlet store) |
| Data Fetching | TanStack React Query v5 + Axios |
| Forms | React Hook Form + Zod v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Fonts | Manrope (heading) + Nunito Sans (body) via Google Fonts |

---

## Design System

- **Aesthetic:** "Aqua Precision" — dark navy `#0B1D35` + cyan `#00B4D8` + amber `#FFB703`
- **Tailwind v4:** tokens via `@theme` di `src/globals.css` — BUKAN `tailwind.config.ts`
- **Border:** 1.5px solid `#E8EDF2` (standar card/modal)
- **Table header bg:** `#F5F7FA`
- **Ghost button bg:** `#E8EDF2`

---

## Coding Rules (WAJIB)

### Forms
- **React Hook Form + Zod** untuk semua form
- `z.number()` bukan `z.coerce.number()` — gunakan `register("field", { valueAsNumber: true })`
- `z.literal(true, { message: "..." })` untuk boolean required (Zod v4)

### Components
- **DRY** — semua shared/small component di `components/ui/`
- **Hooks** — custom hooks untuk semua reusable logic di `hooks/`
- `useFormContext` untuk nested form components (jangan pass `control` as prop)

### Routing (React Router v7 library mode)
- `Link` dari `react-router-dom` (bukan `next/link`)
- `useNavigate()` → `navigate('/path')`, `navigate(-1)` untuk back
- `useLocation().pathname` → ganti `usePathname()`
- `useParams()` → dynamic route params
- `useSearchParams()` → returns `[params, setParams]` (destructure)
- `<Navigate to="..." replace />` → ganti `redirect()`

### Path Alias
- `@/` → root `frontend/` (semua folder: components, hooks, lib, schemas, services, store, types, config, src)

### Zod v4
- Hindari `invalid_type_error`, hindari `z.coerce`
- Gunakan `valueAsNumber` di input untuk angka

### Skeleton component
- Hanya terima `className` dan `style`
- Gunakan `style={{ width, height, borderRadius }}` — jangan shorthand props

---

## User Roles

- **Owner:** Email + Password, akses penuh, bisa multi-outlet
- **Staff:** Username + PIN 6 digit, akses operasional terbatas

## Subscription Plans

- **Regular:** Fitur dasar
- **Pro:** + Profit per layanan, Smart Inventory, Health Score, Anomali alert, Export PDF/Excel

---

## Frontend Progress

| Feature | Status |
|---|---|
| F0 Setup (Vite + deps) | ✅ |
| F1 Auth pages | ✅ |
| F2 Dashboard layout shell | ✅ |
| F3 Dashboard + Overview page | ✅ |
| F4 Orders | ✅ |
| F5 Customers | ✅ |
| F6 Finance (income, expenses, profit) | ✅ |
| F7 Staff management | ✅ |
| F8 Inventory (Pro) | 🔜 Next |
| F9 Settings | 🔲 |

---

## Database

22 tables PostgreSQL — lihat `DATABASE-LaundryKu-MVP1.md` untuk schema lengkap.
PKs = UUID, soft delete via `is_active`, data isolation per outlet.

---

## Important Notes

- **Context7:** Tanya ke user dulu sebelum menggunakannya sebagai referensi
- **Commit:** Jangan commit kecuali diminta user secara eksplisit
- **Ingat:** MEMORY.md di `memory/` untuk catatan sesi-ke-sesi

# LaundryKu Landing Page — CLAUDE.md

> Sub-project instructions untuk Claude Code. Berlaku di dalam folder `landing-page/`.

---

## Overview

**Landing Page LaundryKu** — Marketing/company profile site untuk produk LaundryKu.
**Tujuan:** Konversi pengunjung → registrasi di `app.laundryku.com`
**Status:** MVP ✅ Selesai — semua halaman live & build passes
**Working Dir:** `/Users/zhafrantharif/Documents/Others Project/laundry-app/landing-page`

> ⚠️ Ini adalah sub-project terpisah dari `frontend/` (dashboard SPA).
> Landing page = Next.js App Router. Dashboard = Vite + React Router v7.
> Jangan campur konvensi routing/komponen keduanya.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) |
| Styling | **Tailwind CSS v4** — tokens via `@theme` di `app/globals.css` |
| Blog | **next-mdx-remote v6** — `compileMDX` dari `next-mdx-remote/rsc` |
| Animations | **motion** (framer-motion v12) — ReactBits components |
| Icons | Lucide React |
| Fonts | Manrope (heading) + Nunito Sans (body) — via `next/font/google` |
| Utils | clsx, gray-matter |

---

## Folder Structure

```
landing-page/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme tokens + base styles
│   ├── layout.tsx           ← Root layout (Navbar + Footer + JSON-LD)
│   ├── page.tsx             ← Home (/)
│   ├── about/page.tsx       ← Tentang Kami (/about)
│   ├── features/page.tsx    ← Fitur & Harga (/features)
│   ├── blog/
│   │   ├── page.tsx         ← Blog list (/blog)
│   │   └── [slug]/page.tsx  ← Blog detail (/blog/[slug])
│   ├── contact/page.tsx     ← Kontak (/contact)
│   ├── sitemap.ts           ← Dynamic sitemap
│   └── robots.ts            ← robots.txt
├── components/
│   ├── ui/                  ← Shared: Button, Badge, SectionWrapper, BrandLogo
│   ├── layout/              ← Navbar, Footer, MobileMenu
│   ├── reactbits/           ← Animation components (15 total)
│   ├── home/                ← HeroSection, TrustedBySection, FeaturesSection,
│   │                           HowItWorksSection, PricingSection,
│   │                           TestimonialsSection, CTASection
│   ├── about/               ← VisionSection, TeamSection, StatsSection
│   ├── features/            ← FeatureGrid, ComparisonTable, PricingCards
│   ├── blog/                ← BlogCard, MDXComponents
│   └── contact/             ← ContactForm, ContactInfo
├── content/
│   └── blog/                ← *.mdx artikel (3 dummy articles)
├── lib/
│   ├── data.ts              ← Semua dummy data (FEATURES, PRICING, STATS, dll.)
│   ├── mdx.ts               ← getAllPosts, getPostBySlug
│   └── utils.ts             ← cn(), formatDate()
└── public/                  ← Static assets
```

---

## Design System

Sama dengan dashboard — **"Aqua Precision"**:

| Token | Value |
|---|---|
| Primary (Cyan) | `#00B4D8` |
| Secondary (Amber) | `#FFB703` |
| Navy (Dark) | `#0B1D35` |
| Body text | `#3D5068` / `#5A6B80` |
| Subtle text | `#8899AA` |
| Border standar | `1.5px solid #E8EDF2` |
| Card bg | `white` |
| Section gray bg | `#F5F7FA` / `bg-gray-100` |

---

## Coding Rules (WAJIB)

### Routing — Next.js App Router
- `Link` dari `next/link` (bukan `react-router-dom`)
- `useRouter()` dari `next/navigation`
- `usePathname()` dari `next/navigation`
- Dynamic params: `params: Promise<{ slug: string }>` → `await params`
- Server components by default — tambahkan `"use client"` hanya jika butuh hooks/interactivity

### Fonts
- Gunakan `next/font/google` di `app/layout.tsx` — **jangan** pakai `<link>` Google Fonts manual
- CSS vars: `--font-heading` (Manrope), `--font-body` (Nunito Sans)
- Inline style font: `fontFamily: "Manrope, system-ui"` atau `"Nunito Sans, system-ui"`

### Tailwind v4
- Tokens via `@theme` di `app/globals.css` — **BUKAN** `tailwind.config.ts`
- Plugin: `@tailwindcss/postcss` (bukan `postcss.config.js` manual)

### ReactBits Components
- Semua di `components/reactbits/` — copy-paste, TS + Tailwind variant
- Type animasi: gunakan `TargetAndTransition` (bukan `Variant` dari motion — incompatible dengan `initial`/`animate` props)
- Contoh: `animationFrom?: TargetAndTransition` di SplitText, BlurText

### MDX Blog
- Source: `content/blog/*.mdx` dengan frontmatter gray-matter
- Parser: `compileMDX` dari `next-mdx-remote/rsc` (Server Component)
- Custom components: `components/blog/MDXComponents.tsx`
- Frontmatter fields: `title`, `description`, `date`, `author`, `category`, `readTime`

### Path Alias
- `@/` → root `landing-page/` (dikonfigurasi di `tsconfig.json`)

### Style Pattern
- Inline styles untuk warna, font, border spesifik (bukan Tailwind utility — konsistensi dengan design tokens)
- Tailwind classes untuk layout: `flex`, `grid`, `gap`, `px`, `py`, `rounded`, dll.
- Hindari mix yang tidak konsisten

### Server vs Client Components
- Page files (`app/*/page.tsx`) = **Server Component** (default) → bisa `async`, bisa `generateMetadata`
- Komponen dengan `useState`/`useEffect`/event handlers → tambah `"use client"` di atas file
- Jangan tambah `"use client"` di layout atau page kecuali benar-benar perlu

---

## Pages & Status

| Page | Route | Status |
|---|---|---|
| Home | `/` | ✅ |
| Tentang Kami | `/about` | ✅ |
| Fitur & Harga | `/features` | ✅ |
| Blog List | `/blog` | ✅ |
| Blog Detail | `/blog/[slug]` | ✅ |
| Kontak | `/contact` | ✅ |
| Sitemap | `/sitemap.xml` | ✅ |
| Robots | `/robots.txt` | ✅ |

**Build:** 13 routes, semua static/SSG — `next build` passes ✅
**Dev server:** port `3000` — gunakan `npm run dev` di dalam `landing-page/`

---

## Data & Content

- **Dummy data:** `lib/data.ts` — FEATURES, FEATURES_FULL, PRICING_PLANS, COMPARISON_FEATURES, TESTIMONIALS, HOW_IT_WORKS, STATS, TEAM
- **Blog articles:** 3 MDX di `content/blog/` — tips omzet, pencatatan keuangan, kelola karyawan
- **App URL:** `https://app.laundryku.com/register` (CTA link)
- **Base URL:** `https://laundryku.com` (metadata, sitemap, JSON-LD)

---

## Important Notes

- **Commit:** Jangan commit kecuali diminta user secara eksplisit
- **Context7:** Tanya ke user dulu sebelum menggunakannya sebagai referensi
- **Task tracker:** `../memory/task-landing-page.md`
- **Design docs:** `../docs/plans/2026-02-24-landing-page-design.md`
- **Dev server entry:** dikonfigurasi di `../.claude/launch.json` sebagai `"landing-page"` di port `3000`

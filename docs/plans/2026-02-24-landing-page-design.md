# LaundryKu Landing Page — Design Document

**Date:** 2026-02-24
**Status:** Approved
**Type:** New Web App (Company Profile + Blog)

---

## 1. Overview

Landing page / company profile terpisah dari dashboard SPA. Menjadi wajah utama LaundryKu untuk calon pelanggan. SEO-friendly, interaktif, dan modern.

## 2. Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Blog | MDX via `next-mdx-remote` |
| Animations | ReactBits (copy-paste, TS + Tailwind variant) |
| Icons | Lucide React |
| Fonts | Manrope (heading) + Nunito Sans (body) |

## 3. Folder Structure

```
landing-page/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, navbar, footer)
│   ├── page.tsx                # Home
│   ├── about/page.tsx          # About / Tentang Kami
│   ├── features/page.tsx       # Features + Pricing
│   ├── blog/
│   │   ├── page.tsx            # Blog list
│   │   └── [slug]/page.tsx     # Blog detail (MDX rendered)
│   ├── contact/page.tsx        # Contact
│   └── api/                    # Future API routes
├── components/
│   ├── layout/                 # Navbar, Footer, MobileMenu
│   ├── home/                   # Hero, Features, Testimonials, CTA sections
│   ├── about/                  # Vision, Team, Stats sections
│   ├── features/               # FeatureGrid, ComparisonTable, PricingCards
│   ├── blog/                   # BlogCard, BlogList, MDXComponents
│   ├── contact/                # ContactForm, ContactInfo
│   ├── ui/                     # Button, Badge, Card, SectionWrapper (shared)
│   └── reactbits/              # Copy-pasted ReactBits components
├── content/
│   └── blog/                   # .mdx files for blog articles
├── lib/
│   ├── mdx.ts                  # MDX processing utilities
│   └── utils.ts                # Helper functions
├── public/                     # Static assets (images, icons, og-images)
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## 4. Pages & Sections

### 4.1 Home Page (`/`)

| Section | Deskripsi | ReactBits Components |
|---------|-----------|---------------------|
| Hero | Headline + tagline + CTA "Mulai Gratis" | `SplitText` (headline reveal), `Aurora`/`Silk` (bg), `Magnet` (CTA hover) |
| Trusted By | "Dipercaya 500+ laundry" | `ScrollVelocity` (infinite scroll) |
| Features | 6 fitur utama dengan icons | `AnimatedContent` (scroll reveal), `SpotlightCard` (hover glow) |
| How It Works | 3 steps visual | `CountUp` (angka), `FadeContent` (step reveal) |
| Pricing | 2 plan cards (Regular vs Pro) | `TiltedCard` (hover tilt), `ShinyText` (Pro badge) |
| Testimonials | Review dari user | `Carousel`/`Stack` (testimonial cards) |
| CTA Bottom | "Daftar Sekarang" | `GradientText` (heading), `StarBorder` (button) |

### 4.2 About Page (`/about`)

| Section | ReactBits |
|---------|-----------|
| Visi & Misi | `ScrollReveal` (text reveal on scroll) |
| Tim / Founder | `ProfileCard` (team cards) |
| Statistik | `CountUp` (angka animasi) |

### 4.3 Features + Pricing Page (`/features`)

| Section | ReactBits |
|---------|-----------|
| Feature Grid | `SpotlightCard`, `AnimatedContent` |
| Plan Comparison Table | `GlareHover` (row highlight) |
| Pricing Cards | `TiltedCard`, `ShinyText` |

### 4.4 Blog (`/blog` + `/blog/[slug]`)

| Section | ReactBits |
|---------|-----------|
| Blog List | `FadeContent` (card entrance) |
| Blog Detail | Custom MDX components, `BlurText` (title) |

### 4.5 Contact (`/contact`)

| Section | ReactBits |
|---------|-----------|
| Contact Form | `AnimatedContent` (reveal) |
| Info Cards | Static location/email/phone |

### 4.6 Shared Components

- **Navbar:** Sticky, transparent → solid on scroll, mobile hamburger
- **Footer:** Links, social media, brand logo
- **MobileMenu:** `FlowingMenu` atau slide-in drawer

## 5. Design Tone — Lighter & Friendlier

| Element | Value |
|---------|-------|
| Background utama | White `#FFFFFF` + soft gray `#F8FAFB` (alternating) |
| Text primary | Dark navy `#0B1D35` |
| Text secondary | `#5A6B80` |
| Accent primary | Cyan `#00B4D8` |
| Accent secondary | Amber `#FFB703` |
| Card border | `#E8EDF2` 1px |
| Hero | Light gradient (white → light cyan) + ReactBits Aurora/Silk |
| Fonts | Manrope (heading) + Nunito Sans (body) |
| Border radius | `rounded-2xl` cards, `rounded-xl` buttons |
| Section spacing | `py-20` / `py-24` |

## 6. Blog System (MDX)

- Articles stored in `content/blog/*.mdx`
- Frontmatter schema:
  ```yaml
  title: string
  description: string
  date: string (YYYY-MM-DD)
  author: string
  tags: string[]
  coverImage: string
  published: boolean
  ```
- Processing via `next-mdx-remote`
- 3-5 dummy articles (tips laundry, bisnis UMKM)
- Blog list: grid cards with cover, title, excerpt, date
- Blog detail: full MDX with custom components (callout, image, code)

## 7. SEO Strategy

- Next.js `metadata` API di setiap page
- Open Graph images per page
- `sitemap.xml` via `next-sitemap` atau built-in
- `robots.txt`
- Structured data (JSON-LD) untuk Organization + BlogPosting
- MDX articles get individual meta tags

## 8. ReactBits Components to Copy-Paste

### Text Animations
- `SplitText` — hero headline reveal
- `BlurText` — blog title entrance
- `GradientText` — CTA headings
- `ShinyText` — Pro badge shimmer
- `CountUp` — stat numbers
- `ScrollReveal` — about page text
- `ScrollVelocity` — trusted by logos

### Animations
- `AnimatedContent` — section scroll reveal
- `FadeContent` — card/step entrance
- `Magnet` — button hover effect
- `StarBorder` — CTA button glow
- `GlareHover` — pricing table hover

### Backgrounds
- `Aurora` atau `Silk` — hero section background

### Components
- `SpotlightCard` — feature cards hover
- `TiltedCard` — pricing cards
- `ProfileCard` — team members
- `Carousel` atau `Stack` — testimonials
- `FlowingMenu` — mobile navigation (optional)

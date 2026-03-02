# LaundryKu Landing Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a separate Next.js company profile + blog for LaundryKu with interactive ReactBits animations, MDX blog system, and SEO optimization.

**Architecture:** Next.js 15 App Router with static generation. Pages: Home, About, Features/Pricing, Blog (MDX), Contact. ReactBits components copy-pasted into `components/reactbits/` (TS + Tailwind variant). Design tokens mirrored from dashboard's globals.css. Blog articles as `.mdx` files in `content/blog/`.

**Tech Stack:** Next.js 15, Tailwind CSS v4, TypeScript, next-mdx-remote, ReactBits (copy-paste), Lucide React, Manrope + Nunito Sans fonts

**Design Reference:** `docs/plans/2026-02-24-landing-page-design.md`

**IMPORTANT:** Use `frontend-design` skill when building each page/section for high design quality. Use ReactBits docs from https://reactbits.dev/ for component source code (copy TS + Tailwind variants).

---

## Task 1: Project Scaffolding

**Files:**
- Create: `landing-page/package.json`
- Create: `landing-page/tsconfig.json`
- Create: `landing-page/next.config.mjs`
- Create: `landing-page/app/layout.tsx`
- Create: `landing-page/app/page.tsx`
- Create: `landing-page/app/globals.css`
- Create: `landing-page/.gitignore`

**Step 1: Initialize Next.js 15 project**

```bash
cd "/Users/zhafrantharif/Documents/Others Project/laundry-app/landing-page"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Accept defaults. This creates the full Next.js scaffold.

**Step 2: Install additional dependencies**

```bash
cd "/Users/zhafrantharif/Documents/Others Project/laundry-app/landing-page"
npm install next-mdx-remote gray-matter lucide-react
npm install -D @tailwindcss/typography
```

- `next-mdx-remote` — MDX processing for blog
- `gray-matter` — parse frontmatter from .mdx files
- `lucide-react` — icons (consistent with dashboard)
- `@tailwindcss/typography` — prose styling for blog articles

**Step 3: Verify dev server runs**

```bash
cd "/Users/zhafrantharif/Documents/Others Project/laundry-app/landing-page"
npm run dev
```

Expected: Next.js dev server at http://localhost:3000 with default page.

**Step 4: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): scaffold Next.js 15 project with deps"
```

---

## Task 2: Design Tokens & Global CSS

**Files:**
- Modify: `landing-page/app/globals.css`
- Modify: `landing-page/app/layout.tsx`
- Create: `landing-page/lib/utils.ts`

**Step 1: Set up Tailwind v4 theme tokens in globals.css**

Replace contents of `landing-page/app/globals.css` with LaundryKu design tokens. Mirror tokens from `frontend/src/globals.css` but adapted for landing page's lighter tone:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Colors — Brand */
  --color-primary-400: #33c3e0;
  --color-primary-500: #00b4d8;
  --color-primary-600: #0077b6;
  --color-primary-700: #004e75;

  --color-secondary-400: #ffc633;
  --color-secondary-500: #ffb703;
  --color-secondary-600: #e09600;

  /* Colors — Navy */
  --color-navy-950: #0b1d35;
  --color-navy-900: #132d50;
  --color-navy-800: #1a2d45;
  --color-navy-700: #3d5068;

  /* Colors — Neutral */
  --color-gray-100: #f8fafb;
  --color-gray-200: #f5f7fa;
  --color-gray-300: #e8edf2;
  --color-gray-500: #8899aa;
  --color-gray-600: #5a6b80;

  /* Colors — Semantic */
  --color-success: #00c853;
  --color-warning: #ff6b35;
  --color-error: #ef2d56;

  /* Typography */
  --font-heading: "Manrope", system-ui, sans-serif;
  --font-body: "Nunito Sans", system-ui, sans-serif;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(11, 29, 53, 0.08);
  --shadow-md: 0 4px 12px rgba(11, 29, 53, 0.1);
  --shadow-lg: 0 8px 24px rgba(11, 29, 53, 0.12);
  --shadow-xl: 0 16px 48px rgba(11, 29, 53, 0.16);
}

/* Base styles */
body {
  font-family: var(--font-body);
  color: var(--color-navy-950);
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

/* Animations */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Step 2: Configure root layout with fonts**

Update `landing-page/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Manrope, Nunito_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LaundryKu — Kelola Cerdas, Untung Lebih",
    template: "%s | LaundryKu",
  },
  description:
    "Dashboard manajemen laundry terlengkap untuk UMKM Indonesia. Catat order, kelola keuangan, dan dapatkan insight bisnis cerdas.",
  keywords: ["laundry", "manajemen laundry", "dashboard laundry", "UMKM", "Indonesia"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${manrope.variable} ${nunitoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 3: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from "clsx";
// Note: install clsx if needed: npm install clsx

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
```

Install clsx: `npm install clsx`

**Step 4: Verify fonts render correctly**

Update `landing-page/app/page.tsx` to test:

```tsx
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
        Laundry<span className="text-primary-500">Ku</span>
      </h1>
      <p className="text-lg text-gray-600">Kelola Cerdas, Untung Lebih</p>
    </div>
  );
}
```

Run dev server and check fonts are Manrope (heading) and Nunito Sans (body).

**Step 5: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): setup design tokens, fonts, and globals"
```

---

## Task 3: Shared UI Components

**Files:**
- Create: `landing-page/components/ui/Button.tsx`
- Create: `landing-page/components/ui/Badge.tsx`
- Create: `landing-page/components/ui/SectionWrapper.tsx`
- Create: `landing-page/components/ui/BrandLogo.tsx`

**Step 1: Build Button component**

Follow dashboard Button pattern but simpler (landing page needs fewer variants):

```tsx
// landing-page/components/ui/Button.tsx
"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_STYLES = {
  primary: {
    background: "linear-gradient(135deg, #00B4D8, #0077B6)",
    color: "#FFFFFF",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,180,216,0.30)",
  },
  secondary: {
    background: "#FFB703",
    color: "#0B1D35",
    border: "none",
    boxShadow: "0 4px 12px rgba(255,183,3,0.25)",
  },
  outline: {
    background: "transparent",
    color: "#00B4D8",
    border: "1.5px solid #00B4D8",
  },
  ghost: {
    background: "#E8EDF2",
    color: "#0B1D35",
    border: "none",
  },
} as const;

const SIZE_MAP = { sm: "h-9 px-4 text-sm", md: "h-12 px-6 text-base", lg: "h-14 px-8 text-lg" };

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_MAP[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        ...VARIANT_STYLES[variant],
        fontFamily: "var(--font-heading)",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
```

**Step 2: Build Badge component**

```tsx
// landing-page/components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function Badge({ children, variant = "primary", className = "" }: BadgeProps) {
  const styles = {
    primary: "bg-primary-500/10 text-primary-500",
    secondary: "bg-secondary-500/10 text-secondary-500",
    outline: "border border-gray-300 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {children}
    </span>
  );
}
```

**Step 3: Build SectionWrapper component**

```tsx
// landing-page/components/ui/SectionWrapper.tsx
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  gray?: boolean;
}

export function SectionWrapper({ children, className = "", id, gray }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-20 lg:py-24 ${gray ? "bg-gray-100" : "bg-white"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
```

**Step 4: Build BrandLogo component**

Copy logo SVG from `design-system-v2.jsx`:

```tsx
// landing-page/components/ui/BrandLogo.tsx
interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", showText = true, className = "" }: BrandLogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };
  const boxSizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const s = iconSizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${boxSizes[size]} flex items-center justify-center rounded-xl`}
        style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}
      >
        <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 52 52" fill="none">
          <path d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <path d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6" stroke="#FFB703" strokeWidth="5" strokeLinecap="round" strokeDasharray="6 4" />
          <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-extrabold`} style={{ fontFamily: "var(--font-heading)", color: "#0B1D35" }}>
          Laundry<span className="text-primary-500">Ku</span>
        </span>
      )}
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add landing-page/components/
git commit -m "feat(landing): add shared UI components (Button, Badge, SectionWrapper, BrandLogo)"
```

---

## Task 4: Layout — Navbar & Footer

**Files:**
- Create: `landing-page/components/layout/Navbar.tsx`
- Create: `landing-page/components/layout/Footer.tsx`
- Create: `landing-page/components/layout/MobileMenu.tsx`
- Modify: `landing-page/app/layout.tsx`

**Step 1: Build Navbar**

Sticky navbar, transparent on top → solid white on scroll. Nav links: Beranda, Tentang, Fitur & Harga, Blog, Kontak. CTA button "Mulai Gratis".

```tsx
// landing-page/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Fitur & Harga", href: "/features" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <BrandLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-primary-500 ${
                  pathname === link.href ? "text-primary-500" : "text-navy-950"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Mulai Gratis</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} pathname={pathname} />
    </>
  );
}
```

Note: The `asChild` pattern above is conceptual — for the Button wrapping a Link, use either a wrapper approach or just render Link styled like a Button. Adjust during implementation.

**Step 2: Build MobileMenu**

Slide-in drawer from right for mobile:

```tsx
// landing-page/components/layout/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  pathname: string;
}

export function MobileMenu({ open, onClose, links, pathname }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
        <div className="mt-16 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`text-base font-semibold py-2 ${
                pathname === link.href ? "text-primary-500" : "text-navy-950"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-300 my-2" />
          <Link href="/login" onClick={onClose}>
            <Button variant="outline" fullWidth>Masuk</Button>
          </Link>
          <Link href="/register" onClick={onClose}>
            <Button fullWidth>Mulai Gratis</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Build Footer**

```tsx
// landing-page/components/layout/Footer.tsx
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

const FOOTER_LINKS = {
  Produk: [
    { label: "Fitur", href: "/features" },
    { label: "Harga", href: "/features#pricing" },
    { label: "Blog", href: "/blog" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <BrandLogo size="sm" />
            <p className="mt-4 text-sm text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
              Dashboard manajemen laundry terlengkap untuk UMKM Indonesia.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-navy-800" />

        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} LaundryKu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

**Step 4: Wire Navbar & Footer into root layout**

Modify `landing-page/app/layout.tsx` — wrap `{children}` with Navbar on top, Footer at bottom.

**Step 5: Verify navigation works**

Run dev server, check:
- Navbar is sticky and changes background on scroll
- All links navigate correctly
- Mobile menu opens/closes
- Footer renders at bottom

**Step 6: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): add Navbar, MobileMenu, and Footer layout"
```

---

## Task 5: ReactBits Components Setup

**Files:**
- Create: `landing-page/components/reactbits/SplitText.tsx`
- Create: `landing-page/components/reactbits/BlurText.tsx`
- Create: `landing-page/components/reactbits/GradientText.tsx`
- Create: `landing-page/components/reactbits/ShinyText.tsx`
- Create: `landing-page/components/reactbits/CountUp.tsx`
- Create: `landing-page/components/reactbits/ScrollReveal.tsx`
- Create: `landing-page/components/reactbits/ScrollVelocity.tsx`
- Create: `landing-page/components/reactbits/AnimatedContent.tsx`
- Create: `landing-page/components/reactbits/FadeContent.tsx`
- Create: `landing-page/components/reactbits/Magnet.tsx`
- Create: `landing-page/components/reactbits/StarBorder.tsx`
- Create: `landing-page/components/reactbits/GlareHover.tsx`
- Create: `landing-page/components/reactbits/Aurora.tsx`
- Create: `landing-page/components/reactbits/SpotlightCard.tsx`
- Create: `landing-page/components/reactbits/TiltedCard.tsx`
- Create: `landing-page/components/reactbits/Stack.tsx`

**Step 1: Copy ReactBits components**

For each component:
1. Visit `https://reactbits.dev/<category>/<component-name>`
2. Copy the **TS + Tailwind** variant source code
3. Save to `landing-page/components/reactbits/<ComponentName>.tsx`
4. Add `"use client"` directive at top (all ReactBits components use browser APIs)
5. Install any peer deps if needed (e.g., some components need `gsap` or `framer-motion`)

**Priority order (needed first for Home page):**
1. `SplitText` — hero headline
2. `Aurora` — hero background
3. `AnimatedContent` — section scroll reveal (used everywhere)
4. `FadeContent` — card entrance
5. `SpotlightCard` — feature cards
6. `CountUp` — stat numbers
7. `ShinyText` — Pro badge
8. `TiltedCard` — pricing cards
9. `GradientText` — CTA headings
10. Rest as needed

**Step 2: Install ReactBits peer dependencies**

Check each component for peer deps. Common ones:
```bash
npm install framer-motion  # if used by AnimatedContent, FadeContent, etc.
```

Some components are CSS-only and need no extra deps. Check each.

**Step 3: Test a few components render**

Create a test page at `landing-page/app/test/page.tsx` to verify:
```tsx
"use client";
import { SplitText } from "@/components/reactbits/SplitText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

export default function TestPage() {
  return (
    <div className="p-20 space-y-10">
      <SplitText text="Hello LaundryKu" />
      <SpotlightCard>
        <p>Test card</p>
      </SpotlightCard>
    </div>
  );
}
```

Visit `/test` and verify animations work. Delete test page after confirming.

**Step 4: Commit**

```bash
git add landing-page/components/reactbits/
git commit -m "feat(landing): add ReactBits animation components"
```

---

## Task 6: Home Page

**Files:**
- Modify: `landing-page/app/page.tsx`
- Create: `landing-page/components/home/HeroSection.tsx`
- Create: `landing-page/components/home/TrustedBySection.tsx`
- Create: `landing-page/components/home/FeaturesSection.tsx`
- Create: `landing-page/components/home/HowItWorksSection.tsx`
- Create: `landing-page/components/home/PricingSection.tsx`
- Create: `landing-page/components/home/TestimonialsSection.tsx`
- Create: `landing-page/components/home/CTASection.tsx`
- Create: `landing-page/lib/data.ts` (dummy data for features, pricing, testimonials)

**IMPORTANT:** Use `frontend-design` skill when building each section for high design quality.

**Step 1: Create dummy data file**

```ts
// landing-page/lib/data.ts
import { BarChart3, Users, ShoppingBag, Wallet, TrendingUp, Shield } from "lucide-react";

export const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Kelola Order",
    description: "Catat dan lacak semua order laundry dari masuk hingga selesai. Nota otomatis.",
  },
  {
    icon: Users,
    title: "Data Pelanggan",
    description: "Database pelanggan lengkap dengan riwayat order dan preferensi layanan.",
  },
  {
    icon: Wallet,
    title: "Pencatatan Keuangan",
    description: "Catat pemasukan dan pengeluaran outlet secara detail dan terorganisir.",
  },
  {
    icon: BarChart3,
    title: "Laporan & Insight",
    description: "Dashboard visual dengan grafik pendapatan, tren order, dan performa outlet.",
  },
  {
    icon: TrendingUp,
    title: "Analisis Profit",
    description: "Hitung profit per layanan dan identifikasi layanan paling menguntungkan. (Pro)",
  },
  {
    icon: Shield,
    title: "Health Score",
    description: "Skor kesehatan bisnis harian berdasarkan 5 metrik operasional. (Pro)",
  },
];

export const PRICING_PLANS = [
  {
    name: "Regular",
    price: "99.000",
    period: "/bulan",
    description: "Untuk laundry yang baru mulai go digital",
    features: [
      "Kelola order & nota",
      "Data pelanggan",
      "Pencatatan pengeluaran",
      "Laporan pendapatan",
      "Manajemen karyawan",
      "1 outlet",
    ],
    cta: "Mulai Regular",
    popular: false,
  },
  {
    name: "Pro",
    price: "199.000",
    period: "/bulan",
    description: "Untuk laundry yang ingin scale up",
    features: [
      "Semua fitur Regular",
      "Profit per layanan",
      "Smart Inventory",
      "Health Score harian",
      "Anomali alert",
      "Export PDF & Excel",
      "Multi-outlet (hingga 5)",
    ],
    cta: "Mulai Pro",
    popular: true,
  },
];

export const TESTIMONIALS = [
  {
    name: "Ibu Sari",
    business: "Sari Laundry, Jakarta",
    quote: "Sejak pakai LaundryKu, pencatatan order jadi rapi dan saya bisa lihat mana layanan yang paling untung.",
    avatar: "/avatars/sari.jpg",
  },
  {
    name: "Pak Budi",
    business: "Fresh Clean Laundry, Bandung",
    quote: "Health Score-nya bantu saya tahu kapan perlu improve operasional. Omzet naik 30% dalam 3 bulan!",
    avatar: "/avatars/budi.jpg",
  },
  {
    name: "Mbak Dina",
    business: "Dina Laundry Express, Surabaya",
    quote: "Karyawan saya bisa input order sendiri lewat akun staff. Saya cukup pantau dari HP. Praktis banget!",
    avatar: "/avatars/dina.jpg",
  },
];

export const HOW_IT_WORKS = [
  { step: 1, title: "Daftar & Setup Outlet", description: "Buat akun gratis, isi data outlet Anda dalam 2 menit." },
  { step: 2, title: "Mulai Catat Order", description: "Input order harian, sistem otomatis generate nota dan tracking." },
  { step: 3, title: "Dapatkan Insight", description: "Lihat laporan keuangan, profit per layanan, dan health score bisnis." },
];

export const STATS = [
  { value: 2000, suffix: "+", label: "Outlet Aktif" },
  { value: 150000, suffix: "+", label: "Order/bulan" },
  { value: 99.9, suffix: "%", label: "Uptime" },
];
```

**Step 2: Build HeroSection**

Key elements:
- `Aurora` or `Silk` background (ReactBits)
- `SplitText` for headline animation
- Tagline paragraph
- Two CTA buttons (primary + outline)
- `Magnet` effect on primary CTA
- Stats row below hero

**Step 3: Build TrustedBySection**

- `ScrollVelocity` for infinite logo/text scroll
- "Dipercaya oleh 2.000+ laundry di Indonesia"

**Step 4: Build FeaturesSection**

- 6 feature cards in 2x3 grid (lg) or 1 col (mobile)
- Each card uses `SpotlightCard` (hover glow)
- `AnimatedContent` wraps each for scroll reveal
- Icon + title + description per card

**Step 5: Build HowItWorksSection**

- 3 steps in horizontal layout (lg) or vertical (mobile)
- `CountUp` for step numbers
- `FadeContent` for each step entrance
- Connecting line/dots between steps

**Step 6: Build PricingSection**

- 2 plan cards side by side
- `TiltedCard` for hover effect
- `ShinyText` on "Pro" badge
- Feature checklist with check icons
- CTA button per plan

**Step 7: Build TestimonialsSection**

- `Stack` or `Carousel` from ReactBits
- Avatar + name + business + quote per card
- Auto-rotate or swipe

**Step 8: Build CTASection**

- `GradientText` for headline
- `StarBorder` on CTA button
- Dark navy or gradient background section

**Step 9: Wire all sections in page.tsx**

```tsx
// landing-page/app/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { TrustedBySection } from "@/components/home/TrustedBySection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
```

**Step 10: Verify full Home page**

Run dev server, scroll through all sections, verify:
- Animations trigger on scroll
- Responsive layout (mobile + desktop)
- Colors match design tokens
- All dummy data renders

**Step 11: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): build Home page with all sections"
```

---

## Task 7: About Page

**Files:**
- Create: `landing-page/app/about/page.tsx`
- Create: `landing-page/components/about/VisionSection.tsx`
- Create: `landing-page/components/about/TeamSection.tsx`
- Create: `landing-page/components/about/StatsSection.tsx`

**Step 1: Build VisionSection**

- Visi & Misi content (dummy)
- `ScrollReveal` for text animation
- Two columns: left text, right illustration/icon

**Step 2: Build TeamSection**

- Founder/team cards using `ProfileCard` (ReactBits)
- Name, role, short bio
- 2-3 dummy team members

**Step 3: Build StatsSection**

- `CountUp` for animated numbers
- 3-4 stat cards (outlets, orders, cities, uptime)
- `AnimatedContent` for scroll reveal

**Step 4: Wire page**

```tsx
// landing-page/app/about/page.tsx
import type { Metadata } from "next";
import { VisionSection } from "@/components/about/VisionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { StatsSection } from "@/components/about/StatsSection";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali LaundryKu — platform manajemen laundry untuk UMKM Indonesia.",
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <VisionSection />
      <TeamSection />
      <StatsSection />
    </main>
  );
}
```

**Step 5: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): build About page (vision, team, stats)"
```

---

## Task 8: Features + Pricing Page

**Files:**
- Create: `landing-page/app/features/page.tsx`
- Create: `landing-page/components/features/FeatureGrid.tsx`
- Create: `landing-page/components/features/ComparisonTable.tsx`
- Create: `landing-page/components/features/PricingCards.tsx`

**Step 1: Build FeatureGrid**

- Full feature list (more detailed than home page)
- `SpotlightCard` per feature
- `AnimatedContent` for scroll entrance
- Categorized: Operasional, Keuangan, Insight (Pro)

**Step 2: Build ComparisonTable**

- Regular vs Pro comparison table
- Check/cross icons per feature
- `GlareHover` on table rows
- Responsive: table on desktop, stacked cards on mobile

**Step 3: Build PricingCards**

- Same as home but with more detail
- Duration options (1, 3, 6, 12 bulan) with discounts
- `TiltedCard` + `ShinyText`

**Step 4: Wire page with metadata**

```tsx
export const metadata: Metadata = {
  title: "Fitur & Harga",
  description: "Lihat semua fitur LaundryKu dan pilih paket yang sesuai dengan kebutuhan laundry Anda.",
};
```

**Step 5: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): build Features & Pricing page"
```

---

## Task 9: Blog System (MDX)

**Files:**
- Create: `landing-page/lib/mdx.ts`
- Create: `landing-page/components/blog/BlogCard.tsx`
- Create: `landing-page/components/blog/BlogList.tsx`
- Create: `landing-page/components/blog/MDXComponents.tsx`
- Create: `landing-page/app/blog/page.tsx`
- Create: `landing-page/app/blog/[slug]/page.tsx`
- Create: `landing-page/content/blog/tips-memulai-bisnis-laundry.mdx`
- Create: `landing-page/content/blog/cara-menghitung-profit-laundry.mdx`
- Create: `landing-page/content/blog/5-kesalahan-umum-pemilik-laundry.mdx`

**Step 1: Build MDX processing utility**

```ts
// landing-page/lib/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage: string;
  published: boolean;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author,
        tags: data.tags || [],
        coverImage: data.coverImage || "/blog/default.jpg",
        published: data.published !== false,
        content,
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
```

**Step 2: Build MDXComponents**

Custom components for MDX rendering (callout, image, heading):

```tsx
// landing-page/components/blog/MDXComponents.tsx
import Image from "next/image";

export const mdxComponents = {
  h1: (props: any) => (
    <h1 className="text-3xl font-extrabold text-navy-950 mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }} {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold text-navy-950 mt-8 mb-3" style={{ fontFamily: "var(--font-heading)" }} {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-bold text-navy-950 mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }} {...props} />
  ),
  p: (props: any) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
  a: (props: any) => <a className="text-primary-500 hover:underline" {...props} />,
  img: (props: any) => (
    <figure className="my-6">
      <Image src={props.src} alt={props.alt || ""} width={800} height={400} className="rounded-xl" />
      {props.alt && <figcaption className="mt-2 text-center text-sm text-gray-500">{props.alt}</figcaption>}
    </figure>
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-6" {...props} />
  ),
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 text-gray-600 space-y-1" {...props} />,
};
```

**Step 3: Build BlogCard**

```tsx
// landing-page/components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/mdx";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-gray-300 transition-shadow hover:shadow-lg">
        <div className="aspect-[16/9] overflow-hidden bg-gray-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={600}
            height={338}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
          <h3 className="text-lg font-bold text-navy-950 group-hover:text-primary-500 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.description}</p>
          <p className="mt-3 text-xs text-gray-500">{formatDate(post.date)}</p>
        </div>
      </article>
    </Link>
  );
}
```

**Step 4: Build blog list page**

```tsx
// landing-page/app/blog/page.tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, insight, dan panduan seputar bisnis laundry dan manajemen UMKM.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="pt-20">
      <SectionWrapper>
        <h1 className="text-4xl font-extrabold text-navy-950 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Blog
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Tips dan insight untuk mengembangkan bisnis laundry Anda.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </SectionWrapper>
    </main>
  );
}
```

**Step 5: Build blog detail page**

```tsx
// landing-page/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="pt-20">
      <SectionWrapper>
        <article className="mx-auto max-w-3xl">
          <div className="mb-4 flex gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold text-navy-950 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {post.title}
          </h1>
          <p className="text-gray-500 mb-8">
            {post.author} &middot; {formatDate(post.date)}
          </p>
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </SectionWrapper>
    </main>
  );
}
```

**Step 6: Write 3 dummy MDX articles**

Create 3 `.mdx` files in `content/blog/` with frontmatter + Indonesian content about:
1. `tips-memulai-bisnis-laundry.mdx` — Tips memulai bisnis laundry
2. `cara-menghitung-profit-laundry.mdx` — Cara menghitung profit per layanan
3. `5-kesalahan-umum-pemilik-laundry.mdx` — Kesalahan umum pemilik laundry baru

Each should have ~200-300 words of dummy content with headings, lists, and a blockquote.

**Step 7: Verify blog**

- Blog list page renders all 3 cards
- Click a card → detail page renders MDX correctly
- Meta tags are correct in browser dev tools
- Responsive on mobile

**Step 8: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): build Blog system with MDX + 3 dummy articles"
```

---

## Task 10: Contact Page

**Files:**
- Create: `landing-page/app/contact/page.tsx`
- Create: `landing-page/components/contact/ContactForm.tsx`
- Create: `landing-page/components/contact/ContactInfo.tsx`

**Step 1: Build ContactForm**

Simple form (nama, email, pesan) — no backend yet, just UI:

```tsx
// landing-page/components/contact/ContactForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-300 p-8 text-center">
        <p className="text-lg font-bold text-navy-950" style={{ fontFamily: "var(--font-heading)" }}>
          Terima kasih! Pesan Anda sudah terkirim.
        </p>
        <p className="mt-2 text-gray-600">Kami akan membalas dalam 1x24 jam.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-semibold text-navy-950">Nama</label>
        <input
          type="text"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
          placeholder="Nama lengkap Anda"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-navy-950">Email</label>
        <input
          type="email"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
          placeholder="email@anda.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-navy-950">Pesan</label>
        <textarea
          required
          rows={5}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors resize-none"
          placeholder="Tulis pesan Anda..."
        />
      </div>
      <Button type="submit" fullWidth>Kirim Pesan</Button>
    </form>
  );
}
```

**Step 2: Build ContactInfo**

Cards with email, phone, address (dummy data).

**Step 3: Wire contact page**

Two columns: form left, info cards right.

**Step 4: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): build Contact page with form and info"
```

---

## Task 11: SEO & Final Polish

**Files:**
- Create: `landing-page/app/sitemap.ts`
- Create: `landing-page/app/robots.ts`
- Modify: `landing-page/app/layout.tsx` (JSON-LD)
- Modify: All page files (verify metadata)

**Step 1: Generate sitemap.ts**

```ts
// landing-page/app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url: `https://laundryku.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: "https://laundryku.com", lastModified: new Date() },
    { url: "https://laundryku.com/about", lastModified: new Date() },
    { url: "https://laundryku.com/features", lastModified: new Date() },
    { url: "https://laundryku.com/blog", lastModified: new Date() },
    { url: "https://laundryku.com/contact", lastModified: new Date() },
    ...blogUrls,
  ];
}
```

**Step 2: Create robots.ts**

```ts
// landing-page/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://laundryku.com/sitemap.xml",
  };
}
```

**Step 3: Add JSON-LD structured data**

Add Organization schema in root layout and BlogPosting schema in blog detail page.

**Step 4: Verify all page metadata**

Check each page has proper `<title>`, `<meta name="description">`, Open Graph tags.

**Step 5: Final responsive check**

Test all 5 pages at mobile (375px), tablet (768px), and desktop (1280px) widths.

**Step 6: Commit**

```bash
git add landing-page/
git commit -m "feat(landing): add SEO (sitemap, robots, JSON-LD, metadata)"
```

---

## Summary

| Task | Description | Estimated Steps |
|------|-------------|-----------------|
| 1 | Project Scaffolding | 4 |
| 2 | Design Tokens & CSS | 5 |
| 3 | Shared UI Components | 5 |
| 4 | Layout (Navbar + Footer) | 6 |
| 5 | ReactBits Components | 4 |
| 6 | Home Page (7 sections) | 11 |
| 7 | About Page | 5 |
| 8 | Features + Pricing Page | 5 |
| 9 | Blog System (MDX) | 8 |
| 10 | Contact Page | 4 |
| 11 | SEO & Polish | 6 |
| **Total** | | **63 steps** |

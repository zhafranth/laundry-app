# Vite Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate frontend dashboard dari Next.js 16 ke Vite + React Router v7 (library mode) tanpa kehilangan fungsionalitas yang sudah dibangun (F0–F6).

**Architecture:** Pure SPA dengan Vite sebagai bundler, React Router v7 library mode untuk routing deklaratif, semua folder existing (`components/`, `hooks/`, `lib/`, dll.) tetap di root `frontend/` dengan alias `@/` yang sama. Entry point di `src/main.tsx`, pages dipindah ke `src/pages/`.

**Tech Stack:** Vite 6, React 19, React Router v7 (library mode), TailwindCSS v4 (@tailwindcss/vite), semua deps lain tetap sama.

---

### Task 1: Buat CLAUDE.md + file plan

**Status: ✅ SELESAI**

---

### Task 2: Update package.json

**Files:**
- Modify: `frontend/package.json`

**Step 1: Update package.json**

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@tanstack/react-query": "^5.90.21",
    "@tanstack/react-query-devtools": "^5.91.3",
    "axios": "^1.13.5",
    "lucide-react": "^0.575.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.1",
    "react-router-dom": "^7.0.0",
    "recharts": "^3.7.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^9",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vite": "^6.0.0"
  }
}
```

**Step 2: Run install**
```bash
cd frontend && npm install
```

---

### Task 3: Buat konfigurasi Vite

**Files:**
- Create: `frontend/index.html`
- Create: `frontend/vite.config.ts`
- Modify: `frontend/tsconfig.json`
- Delete: `frontend/next.config.ts`, `frontend/postcss.config.mjs`, `frontend/next-env.d.ts`

**index.html:**
```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LaundryKu — Kelola Cerdas, Untung Lebih</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**vite.config.ts:**
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

**tsconfig.json (updated):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "allowJs": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "src",
    "components",
    "hooks",
    "lib",
    "schemas",
    "services",
    "store",
    "types",
    "config",
    "vite.config.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

### Task 4: Buat src/main.tsx

**Files:**
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/globals.css` (copy dari app/globals.css dengan update fonts)

**src/main.tsx:**
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**src/globals.css** — update bagian `--font-heading` dan `--font-body` di `@theme`:
```css
--font-heading: "Manrope", system-ui, sans-serif;
--font-body: "Nunito Sans", system-ui, sans-serif;
```
(hapus `var(--font-manrope)` dan `var(--font-nunito-sans)` wrapper karena sudah tidak dipakai)

---

### Task 5: Update lib/providers.tsx

**Files:**
- Modify: `frontend/lib/providers.tsx`

Hapus `"use client"` dan sederhanakan getQueryClient (hapus SSR check):

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

### Task 6: Buat src/App.tsx

**Files:**
- Create: `frontend/src/App.tsx`

```tsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { Providers } from "@/lib/providers";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OverviewLayout } from "@/components/layout/OverviewLayout";

// Auth pages
import { LoginPage } from "@/src/pages/auth/LoginPage";
import { RegisterPage } from "@/src/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/src/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/src/pages/auth/ResetPasswordPage";
import { VerifyEmailPage } from "@/src/pages/auth/VerifyEmailPage";

// Onboarding
import { OnboardingPage } from "@/src/pages/onboarding/OnboardingPage";

// Overview
import { OverviewPage } from "@/src/pages/overview/OverviewPage";

// Dashboard
import { DashboardPage } from "@/src/pages/dashboard/DashboardPage";
import { CustomersPage } from "@/src/pages/customers/CustomersPage";
import { CustomerDetailPage } from "@/src/pages/customers/CustomerDetailPage";
import { OrdersPage } from "@/src/pages/orders/OrdersPage";
import { NewOrderPage } from "@/src/pages/orders/NewOrderPage";
import { OrderDetailPage } from "@/src/pages/orders/OrderDetailPage";
import { PrintPage } from "@/src/pages/orders/PrintPage";
import { IncomePage } from "@/src/pages/finance/IncomePage";
import { ExpensesPage } from "@/src/pages/finance/ExpensesPage";
import { ProfitPage } from "@/src/pages/finance/ProfitPage";

function DashboardGroup() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AuthGuard>
  );
}

function OverviewGroup() {
  return (
    <AuthGuard>
      <OverviewLayout>
        <Outlet />
      </OverviewLayout>
    </AuthGuard>
  );
}

const router = createBrowserRouter([
  { index: true, element: <Navigate to="/login" replace /> },

  // Auth
  {
    element: <Outlet />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  // Onboarding (standalone, no auth guard needed — handled inside page)
  { path: "/onboarding", element: <OnboardingPage /> },

  // Overview
  {
    element: <OverviewGroup />,
    children: [{ path: "/overview", element: <OverviewPage /> }],
  },

  // Dashboard
  {
    element: <DashboardGroup />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/customers/:id", element: <CustomerDetailPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/new", element: <NewOrderPage /> },
      { path: "/orders/:id", element: <OrderDetailPage /> },
      { path: "/orders/:id/print", element: <PrintPage /> },
      { path: "/finance/income", element: <IncomePage /> },
      { path: "/finance/expenses", element: <ExpensesPage /> },
      { path: "/finance/profit", element: <ProfitPage /> },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/login" replace /> },
]);

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
```

---

### Task 7: Migrate Pages

Untuk setiap page: buat file baru di `src/pages/`, ubah Next.js imports, hapus "use client" dan metadata.

**Perubahan per page:**
- Hapus `"use client"`
- Hapus `import type { Metadata } from 'next'` + `export const metadata`
- `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`
- `import { useRouter } from 'next/navigation'` → `import { useNavigate } from 'react-router-dom'`
- `const router = useRouter()` → `const navigate = useNavigate()`
- `router.push(x)` → `navigate(x)`
- `router.back()` → `navigate(-1)`
- `router.replace(x)` → `navigate(x, { replace: true })`
- `import { useSearchParams } from 'next/navigation'` → `import { useSearchParams } from 'react-router-dom'`
- `const searchParams = useSearchParams()` → `const [searchParams] = useSearchParams()`
- `import { usePathname } from 'next/navigation'` → `import { useLocation } from 'react-router-dom'`
- `const pathname = usePathname()` → `const { pathname } = useLocation()`
- `const { id } = use(params)` (async params) → `const { id } = useParams()`
- `import { redirect } from 'next/navigation'` → hapus, gunakan `<Navigate>`
- Rename: `export default function XxxPage` → `export function XxxPage` (named export)

---

### Task 8: Update Komponen

13 component files yang perlu update (sama dengan API mapping di atas).

---

### Task 9: Cleanup

- Hapus: `frontend/next.config.ts`
- Hapus: `frontend/postcss.config.mjs`
- Hapus: `frontend/next-env.d.ts`
- Hapus: `frontend/tsconfig.tsbuildinfo`
- Update: `frontend/eslint.config.mjs` — hapus next ESLint imports
- Hapus folder: `frontend/app/` (setelah semua pages dipindah)

---

### Task 10: Install & Verify

```bash
cd frontend
npm install
npm run dev
```

Verify:
- Dev server jalan di localhost:5173
- Semua routes bisa diakses
- AuthGuard redirect ke /login
- Font Manrope + Nunito Sans tampil
- Charts, modals, forms berfungsi

# LaundryKu — Database Schema
## MVP 1 | PostgreSQL
**Version:** 1.0
**Last Updated:** 20 Februari 2026

---

## Entity Relationship Overview

```
Users (Owner)
 ├── 1:N → Outlets
 │         ├── 1:1 → Subscriptions
 │         ├── 1:N → Staff
 │         ├── 1:N → Services
 │         ├── 1:N → Customers
 │         ├── 1:N → Orders
 │         │         └── 1:N → Order_Items
 │         ├── 1:N → Expenses
 │         ├── 1:N → Inventory_Items (Pro)
 │         │         └── 1:N → Inventory_Logs (Pro)
 │         ├── 1:N → Notifications
 │         └── 1:N → Attendances
 └── 1:N → Payments (transaction log)
```

---

## SQL Schema

```sql
-- ============================================================
-- 1. USERS (Owner)
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    email_verified  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);


-- ============================================================
-- 2. OUTLETS
-- ============================================================
CREATE TABLE outlets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    address         TEXT,
    phone           VARCHAR(20),
    logo_url        VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outlets_user ON outlets(user_id);


-- ============================================================
-- 3. SUBSCRIPTIONS
-- ============================================================
-- plan_type: 'regular', 'pro'
-- duration_months: 1, 3, 6, 12
-- status: 'active', 'expired', 'cancelled', 'grace_period'

CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    plan_type           VARCHAR(20) NOT NULL CHECK (plan_type IN ('regular', 'pro')),
    duration_months     INT NOT NULL CHECK (duration_months IN (1, 3, 6, 12)),
    price_paid          DECIMAL(12,2) NOT NULL,
    discount_amount     DECIMAL(12,2) DEFAULT 0,
    discount_reason     VARCHAR(100),           -- e.g. 'multi_outlet_15%'
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'expired', 'cancelled', 'grace_period')),
    auto_renew          BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_outlet ON subscriptions(outlet_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);


-- ============================================================
-- 4. PAYMENTS (Transaction Log)
-- ============================================================
-- payment_for: 'subscription'
-- status: 'pending', 'success', 'failed', 'expired', 'refunded'
-- provider: 'midtrans', 'xendit'

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    subscription_id     UUID REFERENCES subscriptions(id),
    payment_for         VARCHAR(30) NOT NULL DEFAULT 'subscription',
    amount              DECIMAL(12,2) NOT NULL,
    provider            VARCHAR(30),
    provider_ref_id     VARCHAR(255),           -- transaction ID dari payment gateway
    payment_method      VARCHAR(50),            -- 'qris', 'bank_transfer', 'ewallet', etc
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'success', 'failed', 'expired', 'refunded')),
    paid_at             TIMESTAMPTZ,
    expired_at          TIMESTAMPTZ,
    raw_response        JSONB,                  -- full response dari payment gateway
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);


-- ============================================================
-- 5. STAFF
-- ============================================================
-- role: 'kasir', 'operator'

CREATE TABLE staff (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    username        VARCHAR(50) NOT NULL,
    pin_hash        VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'kasir'
                    CHECK (role IN ('kasir', 'operator')),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(outlet_id, username)
);

CREATE INDEX idx_staff_outlet ON staff(outlet_id);


-- ============================================================
-- 6. SESSIONS (Auth Token Tracking)
-- ============================================================
-- user_type: 'owner', 'staff'

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type       VARCHAR(10) NOT NULL CHECK (user_type IN ('owner', 'staff')),
    user_ref_id     UUID NOT NULL,              -- FK ke users.id atau staff.id
    refresh_token   VARCHAR(500) NOT NULL,
    device_info     VARCHAR(300),
    ip_address      VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    last_active_at  TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_type, user_ref_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);


-- ============================================================
-- 7. SERVICES (Jenis Layanan)
-- ============================================================
-- unit: 'kg', 'pcs', 'meter'

CREATE TABLE services (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    price               DECIMAL(12,2) NOT NULL,
    unit                VARCHAR(10) NOT NULL DEFAULT 'kg'
                        CHECK (unit IN ('kg', 'pcs', 'meter')),
    estimated_hours     INT DEFAULT 24,         -- estimasi durasi pengerjaan dalam jam
    sort_order          INT DEFAULT 0,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_outlet ON services(outlet_id);


-- ============================================================
-- 8. CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address         TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(outlet_id, phone)
);

CREATE INDEX idx_customers_outlet ON customers(outlet_id);
CREATE INDEX idx_customers_phone ON customers(outlet_id, phone);
CREATE INDEX idx_customers_name ON customers(outlet_id, name);


-- ============================================================
-- 9. ORDERS
-- ============================================================
-- status: 'pending', 'processing', 'ready', 'completed', 'cancelled'
-- payment_status: 'unpaid', 'partial', 'paid'
-- payment_method: 'cash', 'transfer', 'qris'

CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_number        VARCHAR(20) NOT NULL,       -- format: ORD-XXXX (auto-increment per outlet)
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'processing', 'ready', 'completed', 'cancelled')),
    payment_status      VARCHAR(20) NOT NULL DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
    payment_method      VARCHAR(20),
    subtotal            DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount     DECIMAL(12,2) DEFAULT 0,
    total_amount        DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount         DECIMAL(12,2) DEFAULT 0,
    notes               TEXT,
    estimated_done_at   TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    cancel_reason       VARCHAR(255),
    created_by          UUID,                       -- bisa owner atau staff
    created_by_type     VARCHAR(10),                -- 'owner' atau 'staff'
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_outlet ON orders(outlet_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(outlet_id, status);
CREATE INDEX idx_orders_payment ON orders(outlet_id, payment_status);
CREATE INDEX idx_orders_number ON orders(outlet_id, order_number);
CREATE INDEX idx_orders_created ON orders(outlet_id, created_at DESC);


-- ============================================================
-- 10. ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_id      UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name    VARCHAR(100) NOT NULL,       -- snapshot nama layanan saat order dibuat
    price_per_unit  DECIMAL(12,2) NOT NULL,      -- snapshot harga saat order dibuat
    unit            VARCHAR(10) NOT NULL,
    quantity        DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(12,2) NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_service ON order_items(service_id);


-- ============================================================
-- 11. ORDER STATUS HISTORY
-- ============================================================

CREATE TABLE order_status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status     VARCHAR(20),
    to_status       VARCHAR(20) NOT NULL,
    changed_by      UUID,
    changed_by_type VARCHAR(10),                -- 'owner' atau 'staff'
    notes           VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_history_order ON order_status_history(order_id);


-- ============================================================
-- 12. EXPENSES
-- ============================================================
-- category: 'bahan_baku', 'operasional', 'gaji', 'marketing', 'lainnya'
-- subcategory: Pro-only detail (nullable untuk Regular)

CREATE TABLE expense_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,
    slug            VARCHAR(50) NOT NULL,       -- 'bahan_baku', 'operasional', etc
    is_default      BOOLEAN DEFAULT FALSE,      -- system default categories
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_cat_outlet ON expense_categories(outlet_id);

CREATE TABLE expense_subcategories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,       -- 'deterjen', 'pewangi', 'listrik', etc
    slug            VARCHAR(50) NOT NULL,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    category_id         UUID NOT NULL REFERENCES expense_categories(id),
    subcategory_id      UUID REFERENCES expense_subcategories(id),   -- Pro only
    amount              DECIMAL(12,2) NOT NULL,
    expense_date        DATE NOT NULL,
    notes               TEXT,
    is_recurring        BOOLEAN DEFAULT FALSE,
    recurring_day       INT,                    -- hari ke berapa setiap bulan (1-31)
    created_by          UUID,
    created_by_type     VARCHAR(10),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_outlet ON expenses(outlet_id);
CREATE INDEX idx_expenses_date ON expenses(outlet_id, expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(outlet_id, category_id);


-- ============================================================
-- 13. INVENTORY ITEMS (Pro Only)
-- ============================================================

CREATE TABLE inventory_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    category            VARCHAR(50),            -- 'deterjen', 'pewangi', 'plastik', 'hanger', etc
    unit                VARCHAR(20) NOT NULL,   -- 'kg', 'liter', 'pcs', 'pack', 'botol'
    current_stock       DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_alert     DECIMAL(10,2) NOT NULL DEFAULT 0,
    avg_daily_usage     DECIMAL(10,2) DEFAULT 0,    -- dihitung otomatis dari data
    estimated_days_left INT DEFAULT 0,              -- dihitung otomatis
    last_restocked_at   TIMESTAMPTZ,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_outlet ON inventory_items(outlet_id);


-- ============================================================
-- 14. INVENTORY LOGS (Pro Only)
-- ============================================================
-- type: 'in' (restock), 'out' (pemakaian), 'adjustment'

CREATE TABLE inventory_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id             UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    type                VARCHAR(15) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
    quantity            DECIMAL(10,2) NOT NULL,
    stock_before        DECIMAL(10,2) NOT NULL,
    stock_after         DECIMAL(10,2) NOT NULL,
    unit_cost           DECIMAL(12,2),          -- harga beli per unit (saat restock)
    total_cost          DECIMAL(12,2),          -- total biaya restock
    supplier            VARCHAR(100),
    linked_order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,  -- jika auto-linked ke order
    notes               TEXT,
    created_by          UUID,
    created_by_type     VARCHAR(10),
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inv_logs_item ON inventory_logs(item_id);
CREATE INDEX idx_inv_logs_date ON inventory_logs(created_at DESC);
CREATE INDEX idx_inv_logs_type ON inventory_logs(item_id, type);


-- ============================================================
-- 15. ATTENDANCES (Absensi Staff)
-- ============================================================

CREATE TABLE attendances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    staff_id        UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    clock_in        TIMESTAMPTZ NOT NULL,
    clock_out       TIMESTAMPTZ,
    duration_min    INT,                        -- dihitung otomatis saat clock_out
    notes           VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attendances_outlet ON attendances(outlet_id);
CREATE INDEX idx_attendances_staff ON attendances(staff_id);
CREATE INDEX idx_attendances_date ON attendances(outlet_id, clock_in DESC);


-- ============================================================
-- 16. NOTIFICATIONS
-- ============================================================
-- type: 'order_new', 'order_deadline', 'order_overdue',
--       'stock_low', 'expense_anomaly', 'subscription_expiring',
--       'subscription_expired'

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id       UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    recipient_type  VARCHAR(10) NOT NULL,       -- 'owner', 'staff'
    recipient_id    UUID NOT NULL,
    type            VARCHAR(30) NOT NULL,
    title           VARCHAR(150) NOT NULL,
    message         TEXT NOT NULL,
    data            JSONB,                      -- metadata (order_id, item_id, etc)
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX idx_notif_outlet ON notifications(outlet_id);
CREATE INDEX idx_notif_unread ON notifications(recipient_type, recipient_id, is_read)
    WHERE is_read = FALSE;


-- ============================================================
-- 17. PROFIT ANALYSIS CACHE (Pro Only)
-- ============================================================
-- Materialized/cached table, di-refresh periodik (daily/on-demand)
-- period_type: 'daily', 'weekly', 'monthly'

CREATE TABLE profit_analysis (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    service_id          UUID REFERENCES services(id) ON DELETE CASCADE,
    period_type         VARCHAR(10) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    period_start        DATE NOT NULL,
    period_end          DATE NOT NULL,
    total_orders        INT DEFAULT 0,
    total_quantity      DECIMAL(10,2) DEFAULT 0,
    total_revenue       DECIMAL(14,2) DEFAULT 0,
    allocated_cost      DECIMAL(14,2) DEFAULT 0,
    profit              DECIMAL(14,2) DEFAULT 0,
    margin_pct          DECIMAL(5,2) DEFAULT 0,
    calculated_at       TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(outlet_id, service_id, period_type, period_start)
);

CREATE INDEX idx_profit_outlet ON profit_analysis(outlet_id);
CREATE INDEX idx_profit_period ON profit_analysis(outlet_id, period_type, period_start);


-- ============================================================
-- 18. COST ALLOCATION SETTINGS (Pro Only)
-- ============================================================
-- Owner set persentase alokasi biaya ke tiap layanan

CREATE TABLE cost_allocations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    service_id          UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    allocation_pct      DECIMAL(5,2) NOT NULL DEFAULT 0,    -- persentase dari total biaya
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(outlet_id, service_id)
);


-- ============================================================
-- 19. HEALTH SCORE LOG (Pro Only)
-- ============================================================
-- Snapshot harian health score untuk tracking tren

CREATE TABLE health_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id           UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    score_date          DATE NOT NULL,
    overall_score       INT NOT NULL,           -- 0-100
    profit_margin_score INT,
    revenue_trend_score INT,
    expense_ratio_score INT,
    inventory_score     INT,
    completion_rate_score INT,
    insights            JSONB,                  -- array of insight strings
    created_at          TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(outlet_id, score_date)
);

CREATE INDEX idx_health_outlet ON health_scores(outlet_id, score_date DESC);


-- ============================================================
-- 20. ORDER NUMBER SEQUENCE (per Outlet)
-- ============================================================

CREATE TABLE order_sequences (
    outlet_id       UUID PRIMARY KEY REFERENCES outlets(id) ON DELETE CASCADE,
    last_number     INT NOT NULL DEFAULT 0
);


-- ============================================================
-- SEED DATA: Default Expense Categories
-- ============================================================
-- Saat outlet dibuat, auto-insert kategori default:
--
-- INSERT INTO expense_categories (outlet_id, name, slug, is_default, sort_order) VALUES
-- ('{outlet_id}', 'Bahan Baku',   'bahan_baku',   true, 1),
-- ('{outlet_id}', 'Operasional',  'operasional',  true, 2),
-- ('{outlet_id}', 'Gaji',         'gaji',         true, 3),
-- ('{outlet_id}', 'Marketing',    'marketing',    true, 4),
-- ('{outlet_id}', 'Lain-lain',    'lainnya',      true, 5);
--
-- Sub-kategori default untuk Pro:
-- Bahan Baku:   deterjen, pewangi, plastik, hanger, setrika_spray
-- Operasional:  listrik, air, sewa, internet, maintenance_mesin
-- Gaji:         (per karyawan, dinamis)
-- Marketing:    promo, diskon, iklan
-- Lain-lain:    (custom)
```

---

## Relational Diagram (Text)

```
┌──────────┐       ┌──────────┐       ┌───────────────┐
│  users   │──1:N──│ outlets  │──1:1──│ subscriptions │
└──────────┘       └────┬─────┘       └───────────────┘
                        │
          ┌─────────────┼─────────────────────────────────┐
          │             │             │                    │
     ┌────▼────┐  ┌─────▼──────┐ ┌───▼────────┐  ┌───────▼────────┐
     │  staff  │  │  services  │ │ customers  │  │ expense_cats   │
     └────┬────┘  └─────┬──────┘ └────┬───────┘  └───┬────────────┘
          │             │             │               │
     ┌────▼──────┐      │        ┌────▼───┐    ┌─────▼──────────┐
     │attendances│      │        │ orders │    │expense_subcats │
     └───────────┘      │        └──┬──┬──┘    └────────────────┘
                        │           │  │
                   ┌────▼───────┐   │  │         ┌──────────┐
                   │order_items │◄──┘  └────────▶│ expenses │
                   └────────────┘                └──────────┘
                                    │
                        ┌───────────▼──────────┐
                        │order_status_history  │
                        └──────────────────────┘

     ┌─────────────────┐     ┌──────────────────┐
     │ inventory_items │──N──│ inventory_logs   │
     └─────────────────┘     └──────────────────┘

     ┌──────────────────┐    ┌───────────────────┐
     │ profit_analysis  │    │ cost_allocations  │
     └──────────────────┘    └───────────────────┘

     ┌──────────────────┐    ┌───────────────────┐
     │ health_scores    │    │ notifications     │
     └──────────────────┘    └───────────────────┘

     ┌──────────────────┐    ┌───────────────────┐
     │ payments         │    │ sessions          │
     └──────────────────┘    └───────────────────┘

     ┌──────────────────┐
     │ order_sequences  │
     └──────────────────┘
```

---

## Table Summary

| # | Table | Rows Estimate (1 outlet/6 bulan) | Description |
|---|-------|----------------------------------|-------------|
| 1 | users | 1 | Owner account |
| 2 | outlets | 1-5 | Outlet per owner |
| 3 | subscriptions | 1-10 | History subscription per outlet |
| 4 | payments | 1-10 | Payment transaction log |
| 5 | staff | 1-5 | Karyawan per outlet |
| 6 | sessions | 5-20 | Active login sessions |
| 7 | services | 3-10 | Jenis layanan per outlet |
| 8 | customers | 50-500 | Pelanggan per outlet |
| 9 | orders | 500-5000 | Order per outlet |
| 10 | order_items | 500-7000 | Item detail per order |
| 11 | order_status_history | 1500-15000 | Status change log |
| 12 | expense_categories | 5-10 | Kategori pengeluaran |
| 13 | expense_subcategories | 10-30 | Sub-kategori (Pro) |
| 14 | expenses | 100-500 | Pengeluaran per outlet |
| 15 | inventory_items | 5-20 | Item stok (Pro) |
| 16 | inventory_logs | 100-1000 | Log pergerakan stok (Pro) |
| 17 | attendances | 100-500 | Absensi staff |
| 18 | notifications | 200-2000 | In-app notifications |
| 19 | profit_analysis | 50-200 | Cache analisis profit (Pro) |
| 20 | cost_allocations | 3-10 | Setting alokasi biaya (Pro) |
| 21 | health_scores | 30-180 | Daily health score log (Pro) |
| 22 | order_sequences | 1 | Auto-increment order number |

**Total Tables: 22**

---

## Key Design Decisions

### 1. UUID vs Auto-increment
UUID digunakan untuk semua primary key karena:
- Tidak bisa di-guess (security)
- Safe untuk distributed system di masa depan
- Tidak expose jumlah data

### 2. Snapshot pada Order Items
`service_name` dan `price_per_unit` di-snapshot ke `order_items` karena:
- Harga layanan bisa berubah kapanpun
- Order lama harus tetap mengacu harga saat pembuatan
- `service_id` tetap disimpan untuk referensi analitik

### 3. Expense Categories terpisah per Outlet
Setiap outlet punya kategori sendiri karena:
- Bisa dikustomisasi per outlet
- Default categories di-seed saat outlet dibuat
- Owner bisa tambah/edit kategori tanpa mempengaruhi outlet lain

### 4. Profit Analysis sebagai Cache Table
- Tidak di-query real-time dari orders + expenses (terlalu berat)
- Di-calculate dan simpan ke tabel cache secara periodik (cron job harian)
- Atau di-trigger saat owner buka halaman profit (on-demand refresh)

### 5. Health Score sebagai Daily Snapshot
- Dihitung 1x per hari via scheduled job
- Disimpan sebagai log agar bisa lihat tren
- `insights` field menggunakan JSONB untuk fleksibilitas

### 6. Soft Delete via is_active
- Outlet, Staff, Services, Inventory Items menggunakan `is_active` flag
- Data tidak benar-benar dihapus untuk menjaga referential integrity
- Hard delete hanya untuk data yang benar-benar tidak diperlukan

---

## Indexes Strategy

- **Primary queries** (outlet_id + filter) mendapat composite index
- **Search queries** (nama, phone) mendapat text index
- **Time-series queries** (created_at DESC) mendapat descending index
- **Partial index** pada notifications (is_read = FALSE) untuk query notifikasi unread yang sering

---

## Migration Order

Urutan migrasi (karena foreign key dependencies):

```
1.  users
2.  outlets
3.  subscriptions
4.  payments
5.  staff
6.  sessions
7.  services
8.  customers
9.  orders
10. order_items
11. order_status_history
12. order_sequences
13. expense_categories
14. expense_subcategories
15. expenses
16. inventory_items
17. inventory_logs
18. attendances
19. notifications
20. profit_analysis
21. cost_allocations
22. health_scores
```

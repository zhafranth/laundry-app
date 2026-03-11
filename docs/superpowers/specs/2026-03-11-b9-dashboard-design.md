# B9 Dashboard Backend — Design Spec

**Date:** 2026-03-11
**Status:** Approved
**Module:** `backend/src/dashboard/`

---

## Endpoints

### 1. GET `/api/outlets/:id/dashboard`

**Auth:** JwtAuthGuard + RolesGuard (owner, staff) + OutletAccessGuard
**Purpose:** Single outlet dashboard statistics

**Response type:** `DashboardStats`

```typescript
{
  todayRevenue: number;              // sum paid orders today
  todayRevenueChangePercent: number; // vs yesterday
  activeOrders: number;              // status IN (pending, processing, ready)
  approachingDeadlineCount: number;  // estimated_done_at within 24h
  todayExpenses: number;             // sum expenses today
  monthlyCustomers: number;          // distinct customers with orders this month
  healthScore: number | null;        // Pro only, from health_scores table
  healthScoreComponents: {           // Pro only
    profitMargin: number;
    revenueTrend: number;
    expenseRatio: number;
    inventoryHealth: number;
    completionRate: number;
  } | null;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    services: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
  }>;
  revenueChart: Array<{              // last 7 days
    date: string;       // YYYY-MM-DD
    label: string;      // day name
    revenue: number;
  }>;
  insights: Array<{                  // Pro only
    id: string;
    text: string;
    type: "success" | "warning" | "info";
  }>;
  alerts: Array<{                    // Pro only
    id: string;
    text: string;
    type: "stock" | "expense";
  }>;
}
```

### 2. GET `/api/outlets/overview`

**Auth:** JwtAuthGuard + RolesGuard (owner only)
**Purpose:** Multi-outlet overview for owners with multiple outlets

**Response type:** `OutletOverviewRow[]`

```typescript
Array<{
  id: string;
  name: string;
  plan: "regular" | "pro";
  subscriptionStatus: "active" | "expiring" | "expired";
  subscriptionEndDate: string;
  monthlyRevenue: number;
  monthlyOrders: number;
  activeOrders: number;
}>
```

---

## Data Sources & Calculations

| Metric | Source Table(s) | Logic |
|---|---|---|
| todayRevenue | orders | SUM(total_amount) WHERE payment_status='paid' AND created today |
| todayRevenueChangePercent | orders | (today - yesterday) / yesterday * 100 |
| activeOrders | orders | COUNT WHERE status IN (pending, processing, ready) |
| approachingDeadlineCount | orders | COUNT WHERE active AND estimated_done_at within 24h |
| todayExpenses | expenses | SUM(amount) WHERE expense_date = today |
| monthlyCustomers | orders + customers | COUNT DISTINCT customer_id WHERE order created this month |
| healthScore | health_scores | Latest record for outlet |
| revenueChart | orders | GROUP BY date, last 7 days, SUM paid amounts |
| recentOrders | orders + customers + order_items | Last 5 orders with joins |
| insights | health_scores.insights | JSONB field from latest health_score |
| alerts (stock) | inventory_items | WHERE current_stock <= min_stock_alert |
| alerts (expense) | expenses | Anomaly: amount > 120% of 3-month average category |
| overview stats | outlets + subscriptions + orders | Per-outlet aggregates |

---

## Architecture

- **Module:** `DashboardModule` (1 controller, 1 service)
- **Pattern:** Follow existing NestJS modules (orders, finance)
- **Guards:** Reuse JwtAuthGuard, RolesGuard, OutletAccessGuard
- **No DTOs needed** — both endpoints are simple GETs with no query params
- **Pro gating:** Service checks outlet's subscription plan, returns null for Pro-only fields on Regular plan

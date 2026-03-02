// ===== API Response Wrappers =====

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ===== Auth & User =====

export type UserRole = "owner" | "staff";
export type PlanType = "regular" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  createdAt: string;
  updatedAt: string;
}

export type StaffRole = "kasir" | "operator";

export interface Staff {
  id: string;
  outletId: string;
  name: string;
  username: string;
  phone: string | null;
  role: StaffRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  staffName: string;
  outletId: string;
  clockIn: string;
  clockOut: string | null;
  workDurationMinutes: number | null;
  date: string;
}

// ===== Outlet =====

export interface Outlet {
  id: string;
  userId: string;
  name: string;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== Service Catalog =====

export type ServiceUnit = "kg" | "pcs" | "meter";

export interface Service {
  id: string;
  outletId: string;
  name: string;
  pricePerUnit: number;
  unit: ServiceUnit;
  estimatedDuration: number; // hours
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== Customer =====

export interface Customer {
  id: string;
  outletId: string;
  name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  totalOrders: number;
  totalSpending: number;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Order Status =====

export type OrderStatus =
  | "masuk"
  | "proses"
  | "siap_diambil"
  | "selesai"
  | "dibatalkan"
  | "overdue";

export type OrderPaymentStatus = "belum_bayar" | "dp" | "lunas";
export type PaymentStatus = "belum_bayar" | "lunas"; // legacy for dashboard
export type PaymentMethod = "tunai" | "transfer" | "qris";

// ===== Order =====

export interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  pricePerUnit: number;
  unit: string;
  qty: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
  createdByName: string;
}

export interface Order {
  id: string;
  outletId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: PaymentMethod | null;
  status: OrderStatus;
  notes: string | null;
  estimatedFinishedAt: string | null;
  finishedAt: string | null;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

// ===== Common Utility Types =====

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface DateRange {
  from: string;
  to: string;
}

// ===== Dashboard =====

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  services: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface DashboardRevenueSeries {
  date: string;
  label: string;
  revenue: number;
}

export interface DashboardInsight {
  id: string;
  text: string;
  type: "success" | "warning" | "info";
}

export interface DashboardAlert {
  id: string;
  text: string;
  type: "stock" | "expense";
}

export interface HealthScoreComponents {
  profitMargin: number;
  revenueTrend: number;
  expenseRatio: number;
  inventoryHealth: number;
  completionRate: number;
}

export interface DashboardStats {
  todayRevenue: number;
  todayRevenueChangePercent: number;
  activeOrders: number;
  approachingDeadlineCount: number;
  todayExpenses: number;
  monthlyCustomers: number;
  healthScore: number | null;
  healthScoreComponents: HealthScoreComponents | null;
  recentOrders: DashboardRecentOrder[];
  revenueChart: DashboardRevenueSeries[];
  insights: DashboardInsight[];
  alerts: DashboardAlert[];
}

// ===== Overview =====

export type SubscriptionStatus = "active" | "expiring" | "expired";

export interface OutletOverviewRow {
  id: string;
  name: string;
  plan: PlanType;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string;
  monthlyRevenue: number;
  monthlyOrders: number;
  activeOrders: number;
}

// ===== Finance: Expense =====

export type ExpenseCategorySlug =
  | "bahan_baku"
  | "operasional"
  | "gaji"
  | "marketing"
  | "lain_lain";

export interface ExpenseCategory {
  id: string;
  outletId: string;
  name: string;
  slug: ExpenseCategorySlug;
  isDefault: boolean;
  sortOrder: number;
}

export interface ExpenseSubcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Expense {
  id: string;
  outletId: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  amount: number;
  expenseDate: string;
  notes: string | null;
  isRecurring: boolean;
  recurringDay: number | null;
  createdByName: string;
  createdByType: "owner" | "staff";
  createdAt: string;
  updatedAt: string;
}

// ===== Finance: Income =====

export interface IncomeTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  serviceSummary: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
}

export interface IncomeDailySeries {
  date: string;
  label: string;
  amount: number;
}

export interface IncomeSummary {
  totalIncome: number;
  totalIncomeChangePercent: number;
  totalTransactions: number;
  dailyChart: IncomeDailySeries[];
  transactions: IncomeTransaction[];
}

// ===== Finance: Profit (Pro) =====

export interface ProfitByService {
  serviceId: string;
  serviceName: string;
  totalOrders: number;
  totalRevenue: number;
  estimatedCost: number;
  profit: number;
  marginPercent: number;
}

export interface CostAllocation {
  serviceId: string;
  serviceName: string;
  allocationPercent: number;
}

// ===== Inventory =====

export type InventoryStatus = "aman" | "perhatian" | "kritis";

export interface InventoryItem {
  id: string;
  outletId: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minimumStock: number;
  avgDailyUsage: number | null;
  estimatedDaysLeft: number | null;
  lastRestockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  inventoryItemId: string;
  itemName: string;
  type: "masuk" | "keluar";
  qty: number;
  unitCost: number | null;
  supplier: string | null;
  notes: string | null;
  logDate: string;
  createdByName: string;
  createdAt: string;
}

// ===== Subscription =====

export type PaymentStatusType = "pending" | "paid" | "failed" | "expired";

export interface Subscription {
  id: string;
  outletId: string;
  outletName: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  price: number;
  durationMonths: number;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  plan: PlanType;
  durationMonths: number;
  amount: number;
  status: PaymentStatusType;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
}

// ===== Notification =====

export type NotificationType =
  | "order_new"
  | "order_deadline"
  | "stock_low"
  | "expense_alert"
  | "system";

export interface Notification {
  id: string;
  outletId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

// ===== Finance: Expense Summary =====

export interface ExpenseSummary {
  totalExpenses: number;
  totalExpensesChangePercent: number;
  costPerKg: number | null;
  highestCategory: string;
  highestCategoryAmount: number;
}

export interface ExpenseTrendSeries {
  month: string;
  label: string;
  total: number;
  bahan_baku?: number;
  operasional?: number;
  gaji?: number;
  marketing?: number;
  lain_lain?: number;
}

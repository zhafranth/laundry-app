type OrderParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

type ExpenseParams = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export const queryKeys = {
  // Auth
  auth: {
    me: ["auth", "me"] as const,
  },

  // Outlets
  outlets: {
    list: ["outlets"] as const,
    detail: (id: string) => ["outlets", id] as const,
  },

  // Services
  services: {
    list: (outletId: string) => ["services", outletId] as const,
    detail: (outletId: string, id: string) => ["services", outletId, id] as const,
  },

  // Customers
  customers: {
    list: (outletId: string, params?: { page?: number; search?: string; sortBy?: string; sortOrder?: string }) =>
      ["customers", outletId, params] as const,
    detail: (outletId: string, id: string) => ["customers", outletId, id] as const,
    orders: (outletId: string, customerId: string, params?: { page?: number }) =>
      ["customers", outletId, customerId, "orders", params] as const,
  },

  // Orders
  orders: {
    list: (outletId: string, params?: OrderParams) =>
      ["orders", outletId, params] as const,
    detail: (outletId: string, id: string) => ["orders", outletId, id] as const,
    statusHistory: (orderId: string) => ["orders", orderId, "history"] as const,
  },

  // Staff
  staff: {
    list: (outletId: string) => ["staff", outletId] as const,
    detail: (outletId: string, id: string) => ["staff", outletId, id] as const,
    attendance: (outletId: string, params?: { dateFrom?: string; dateTo?: string }) =>
      ["staff", outletId, "attendance", params] as const,
  },

  // Expenses
  expenses: {
    categories: (outletId: string) => ["expenses", outletId, "categories"] as const,
    list: (outletId: string, params?: ExpenseParams) =>
      ["expenses", outletId, params] as const,
    detail: (outletId: string, id: string) => ["expenses", outletId, id] as const,
  },

  // Finance: Income
  income: {
    summary: (
      outletId: string,
      params?: {
        dateFrom?: string;
        dateTo?: string;
        paymentMethod?: string;
        serviceId?: string;
      }
    ) => ["income", outletId, "summary", params] as const,
    list: (
      outletId: string,
      params?: {
        page?: number;
        pageSize?: number;
        dateFrom?: string;
        dateTo?: string;
        paymentMethod?: string;
        serviceId?: string;
      }
    ) => ["income", outletId, params] as const,
  },

  // Finance: Profit (Pro)
  profit: {
    list: (outletId: string, period?: string) =>
      ["profit", outletId, period] as const,
    costAllocations: (outletId: string) =>
      ["profit", outletId, "allocations"] as const,
  },

  // Inventory
  inventory: {
    list: (outletId: string) => ["inventory", outletId] as const,
    detail: (outletId: string, id: string) => ["inventory", outletId, id] as const,
    logs: (outletId: string, itemId: string) =>
      ["inventory", outletId, itemId, "logs"] as const,
  },

  // Reports / Dashboard
  reports: {
    dashboard: (outletId: string, period: string) =>
      ["reports", outletId, "dashboard", period] as const,
    revenue: (outletId: string, params?: { dateFrom?: string; dateTo?: string }) =>
      ["reports", outletId, "revenue", params] as const,
    profitAnalysis: (outletId: string, period: string) =>
      ["reports", outletId, "profit", period] as const,
    healthScore: (outletId: string) => ["reports", outletId, "health-score"] as const,
  },

  // Notifications
  notifications: {
    list: (outletId: string) => ["notifications", outletId] as const,
    unreadCount: (outletId: string) =>
      ["notifications", outletId, "unread-count"] as const,
  },

  // Subscriptions
  subscriptions: {
    current: ["subscriptions", "current"] as const,
    history: ["subscriptions", "history"] as const,
  },
};

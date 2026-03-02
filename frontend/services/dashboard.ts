import api from "@/lib/axios";
import type { ApiResponse, DashboardStats, OutletOverviewRow } from "@/types";

export const dashboardService = {
  getStats: (outletId: string) =>
    api
      .get<ApiResponse<DashboardStats>>(`/outlets/${outletId}/dashboard`)
      .then((r) => r.data),

  getOverview: () =>
    api
      .get<ApiResponse<OutletOverviewRow[]>>("/outlets/overview")
      .then((r) => r.data),
};

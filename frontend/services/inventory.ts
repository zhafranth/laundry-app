import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, InventoryItem, InventoryLog } from "@/types";
import type { InventoryItemFormValues, RestockFormValues, UsageFormValues } from "@/schemas/inventory";

export const inventoryService = {
  getList: (
    outletId: string,
    params?: { search?: string; category?: string; status?: string }
  ) =>
    api
      .get<ApiResponse<InventoryItem[]>>(`/outlets/${outletId}/inventory`, { params })
      .then((r) => r.data),

  getDetail: (outletId: string, id: string) =>
    api
      .get<ApiResponse<InventoryItem>>(`/outlets/${outletId}/inventory/${id}`)
      .then((r) => r.data),

  create: (outletId: string, data: InventoryItemFormValues) =>
    api
      .post<ApiResponse<InventoryItem>>(`/outlets/${outletId}/inventory`, data)
      .then((r) => r.data),

  update: (outletId: string, id: string, data: InventoryItemFormValues) =>
    api
      .patch<ApiResponse<InventoryItem>>(`/outlets/${outletId}/inventory/${id}`, data)
      .then((r) => r.data),

  delete: (outletId: string, id: string) =>
    api
      .delete<ApiResponse<null>>(`/outlets/${outletId}/inventory/${id}`)
      .then((r) => r.data),

  restock: (outletId: string, id: string, data: RestockFormValues) =>
    api
      .post<ApiResponse<InventoryLog>>(`/outlets/${outletId}/inventory/${id}/restock`, data)
      .then((r) => r.data),

  logUsage: (outletId: string, id: string, data: UsageFormValues) =>
    api
      .post<ApiResponse<InventoryLog>>(`/outlets/${outletId}/inventory/${id}/usage`, data)
      .then((r) => r.data),

  getLogs: (
    outletId: string,
    itemId: string,
    params?: {
      page?: number;
      pageSize?: number;
      type?: "masuk" | "keluar";
      dateFrom?: string;
      dateTo?: string;
    }
  ) =>
    api
      .get<PaginatedResponse<InventoryLog>>(
        `/outlets/${outletId}/inventory/${itemId}/logs`,
        { params }
      )
      .then((r) => r.data),
};

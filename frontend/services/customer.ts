import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Customer, Order } from "@/types";

export type CustomerSortField = "name" | "totalOrders" | "totalSpending" | "lastOrderAt";
export type SortOrder = "asc" | "desc";

export const customerService = {
  getList: (
    outletId: string,
    params?: {
      page?: number;
      search?: string;
      sortBy?: CustomerSortField;
      sortOrder?: SortOrder;
    }
  ) =>
    api
      .get<PaginatedResponse<Customer>>(`/outlets/${outletId}/customers`, {
        params,
      })
      .then((r) => r.data),

  search: (outletId: string, query: string) =>
    api
      .get<ApiResponse<Customer[]>>(`/outlets/${outletId}/customers/search`, {
        params: { q: query },
      })
      .then((r) => r.data),

  getDetail: (outletId: string, customerId: string) =>
    api
      .get<ApiResponse<Customer>>(`/outlets/${outletId}/customers/${customerId}`)
      .then((r) => r.data),

  create: (
    outletId: string,
    data: { name: string; phone: string; address?: string; notes?: string }
  ) =>
    api
      .post<ApiResponse<Customer>>(`/outlets/${outletId}/customers`, data)
      .then((r) => r.data),

  update: (
    outletId: string,
    customerId: string,
    data: { name?: string; phone?: string; address?: string; notes?: string }
  ) =>
    api
      .patch<ApiResponse<Customer>>(
        `/outlets/${outletId}/customers/${customerId}`,
        data
      )
      .then((r) => r.data),

  delete: (outletId: string, customerId: string) =>
    api
      .delete<ApiResponse<null>>(
        `/outlets/${outletId}/customers/${customerId}`
      )
      .then((r) => r.data),

  getOrders: (outletId: string, customerId: string, params?: { page?: number; pageSize?: number }) =>
    api
      .get<PaginatedResponse<Order>>(
        `/outlets/${outletId}/customers/${customerId}/orders`,
        { params }
      )
      .then((r) => r.data),
};

import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Order, OrderStatus } from "@/types";
import type { CreateOrderInput } from "@/schemas/order";

type OrderListParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  serviceId?: string;
};

export const orderService = {
  getList: (outletId: string, params?: OrderListParams) =>
    api
      .get<PaginatedResponse<Order>>(`/outlets/${outletId}/orders`, { params })
      .then((r) => r.data),

  getDetail: (outletId: string, orderId: string) =>
    api
      .get<ApiResponse<Order>>(`/outlets/${outletId}/orders/${orderId}`)
      .then((r) => r.data),

  create: (outletId: string, data: CreateOrderInput) =>
    api
      .post<ApiResponse<Order>>(`/outlets/${outletId}/orders`, data)
      .then((r) => r.data),

  update: (outletId: string, orderId: string, data: Partial<CreateOrderInput>) =>
    api
      .patch<ApiResponse<Order>>(`/outlets/${outletId}/orders/${orderId}`, data)
      .then((r) => r.data),

  updateStatus: (
    outletId: string,
    orderId: string,
    status: OrderStatus,
    note?: string
  ) =>
    api
      .patch<ApiResponse<Order>>(
        `/outlets/${outletId}/orders/${orderId}/status`,
        { status, note }
      )
      .then((r) => r.data),

  markPaid: (
    outletId: string,
    orderId: string,
    paidAmount: number,
    paymentMethod: string
  ) =>
    api
      .patch<ApiResponse<Order>>(
        `/outlets/${outletId}/orders/${orderId}/payment`,
        { paidAmount, paymentMethod }
      )
      .then((r) => r.data),

  delete: (outletId: string, orderId: string) =>
    api
      .delete<ApiResponse<null>>(`/outlets/${outletId}/orders/${orderId}`)
      .then((r) => r.data),
};

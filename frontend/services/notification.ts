import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Notification } from "@/types";

export const notificationService = {
  getList: (
    outletId: string,
    params?: { page?: number; pageSize?: number; isRead?: boolean }
  ) =>
    api
      .get<PaginatedResponse<Notification>>(`/outlets/${outletId}/notifications`, { params })
      .then((r) => r.data),

  getUnreadCount: (outletId: string) =>
    api
      .get<ApiResponse<{ count: number }>>(`/outlets/${outletId}/notifications/unread-count`)
      .then((r) => r.data),

  markRead: (outletId: string, id: string) =>
    api
      .patch<ApiResponse<null>>(`/outlets/${outletId}/notifications/${id}/read`)
      .then((r) => r.data),

  markAllRead: (outletId: string) =>
    api
      .patch<ApiResponse<null>>(`/outlets/${outletId}/notifications/read-all`)
      .then((r) => r.data),
};

import api from "@/lib/axios";
import type { ApiResponse, Outlet } from "@/types";

export const outletService = {
  getMyOutlets: () =>
    api.get<ApiResponse<Outlet[]>>("/outlets").then((r) => r.data),

  getOutlet: (outletId: string) =>
    api.get<ApiResponse<Outlet>>(`/outlets/${outletId}`).then((r) => r.data),

  createOutlet: (data: { name: string; address?: string; phone?: string }) =>
    api.post<ApiResponse<Outlet>>("/outlets", data).then((r) => r.data),

  updateOutlet: (
    outletId: string,
    data: { name?: string; address?: string; phone?: string }
  ) =>
    api.patch<ApiResponse<Outlet>>(`/outlets/${outletId}`, data).then((r) => r.data),

  uploadLogo: (outletId: string, file: File) => {
    const form = new FormData();
    form.append("logo", file);
    return api
      .post<ApiResponse<{ logoUrl: string }>>(`/outlets/${outletId}/logo`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

import api from "@/lib/axios";
import type { ApiResponse, Service } from "@/types";
import type { ServiceFormValues } from "@/schemas/settings";

export const serviceService = {
  getByOutlet: (outletId: string) =>
    api
      .get<ApiResponse<Service[]>>(`/outlets/${outletId}/services`)
      .then((r) => r.data),

  create: (outletId: string, data: ServiceFormValues) =>
    api
      .post<ApiResponse<Service>>(`/outlets/${outletId}/services`, data)
      .then((r) => r.data),

  update: (outletId: string, serviceId: string, data: Partial<ServiceFormValues>) =>
    api
      .patch<ApiResponse<Service>>(`/outlets/${outletId}/services/${serviceId}`, data)
      .then((r) => r.data),

  delete: (outletId: string, serviceId: string) =>
    api
      .delete<ApiResponse<void>>(`/outlets/${outletId}/services/${serviceId}`)
      .then((r) => r.data),

  reorder: (outletId: string, orderedIds: string[]) =>
    api
      .patch<ApiResponse<void>>(`/outlets/${outletId}/services/reorder`, { orderedIds })
      .then((r) => r.data),
};

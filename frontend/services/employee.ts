import api from "@/lib/axios";
import type { ApiResponse, PaginatedResponse, Staff, Attendance } from "@/types";
import type { StaffCreateFormValues, StaffEditFormValues } from "@/schemas/employee";

export type StaffSortField = "name" | "role" | "createdAt";
export type SortOrder = "asc" | "desc";

export const employeeService = {
  // ── Staff CRUD ───────────────────────────────────────────────────────
  getList: (
    outletId: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      isActive?: boolean;
      sortBy?: StaffSortField;
      sortOrder?: SortOrder;
    }
  ) =>
    api
      .get<PaginatedResponse<Staff>>(`/outlets/${outletId}/staff`, { params })
      .then((r) => r.data),

  create: (outletId: string, data: StaffCreateFormValues) =>
    api
      .post<ApiResponse<Staff>>(`/outlets/${outletId}/staff`, data)
      .then((r) => r.data),

  update: (outletId: string, staffId: string, data: StaffEditFormValues) =>
    api
      .patch<ApiResponse<Staff>>(`/outlets/${outletId}/staff/${staffId}`, data)
      .then((r) => r.data),

  delete: (outletId: string, staffId: string) =>
    api
      .delete<ApiResponse<null>>(`/outlets/${outletId}/staff/${staffId}`)
      .then((r) => r.data),

  setActive: (outletId: string, staffId: string, isActive: boolean) =>
    api
      .patch<ApiResponse<Staff>>(`/outlets/${outletId}/staff/${staffId}`, { isActive })
      .then((r) => r.data),

  resetPin: (outletId: string, staffId: string, newPin: string) =>
    api
      .patch<ApiResponse<null>>(`/outlets/${outletId}/staff/${staffId}/reset-pin`, { pin: newPin })
      .then((r) => r.data),

  // ── Attendance ───────────────────────────────────────────────────────
  getAttendance: (
    outletId: string,
    params?: {
      page?: number;
      pageSize?: number;
      staffId?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ) =>
    api
      .get<PaginatedResponse<Attendance>>(`/outlets/${outletId}/attendance`, { params })
      .then((r) => r.data),

  getTodayStatus: (outletId: string) =>
    api
      .get<ApiResponse<{ isClockedIn: boolean; clockIn?: string; clockOut?: string | null }>>(`/outlets/${outletId}/attendance/today`)
      .then((r) => r.data),

  clockIn: (outletId: string) =>
    api
      .post<ApiResponse<Attendance>>(`/outlets/${outletId}/attendance/clock-in`)
      .then((r) => r.data),

  clockOut: (outletId: string) =>
    api
      .post<ApiResponse<Attendance>>(`/outlets/${outletId}/attendance/clock-out`)
      .then((r) => r.data),
};

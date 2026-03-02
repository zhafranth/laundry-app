import api from "@/lib/axios";
import type { ApiResponse, Subscription, PaymentHistory } from "@/types";

export const subscriptionService = {
  getCurrent: () =>
    api.get<ApiResponse<Subscription>>("/subscriptions/current").then((r) => r.data),

  getHistory: () =>
    api.get<ApiResponse<PaymentHistory[]>>("/subscriptions/history").then((r) => r.data),
};

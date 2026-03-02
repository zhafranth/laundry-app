import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanType } from "@/types";

export type UserRole = "owner" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  username?: string;
  role: UserRole;
  plan?: PlanType;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  activeOutletId: string | null;

  // Actions
  setAuth: (params: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  setActiveOutlet: (outletId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      activeOutletId: null,

      setAuth: ({ accessToken, refreshToken, user }) => {
        // Sync to localStorage for Axios interceptor
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        set({ accessToken, refreshToken, user });
      },

      setActiveOutlet: (outletId) => {
        set({ activeOutletId: outletId });
      },

      clearAuth: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ accessToken: null, refreshToken: null, user: null, activeOutletId: null });
      },
    }),
    {
      name: "laundryku-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        activeOutletId: state.activeOutletId,
      }),
    }
  )
);

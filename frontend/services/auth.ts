import api from "@/lib/axios";
import type { ApiResponse } from "@/types";
import type { LoginOwnerInput, LoginStaffInput, RegisterInput } from "@/schemas/auth";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  username?: string;
  role: "owner" | "staff";
  plan?: "regular" | "pro";
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export const authService = {
  loginOwner: (data: LoginOwnerInput) =>
    api
      .post<ApiResponse<LoginResponse>>("/auth/login", {
        email: data.email,
        password: data.password,
      })
      .then((r) => r.data),

  loginStaff: (data: LoginStaffInput) =>
    api
      .post<ApiResponse<LoginResponse>>("/auth/staff/login", data)
      .then((r) => r.data),

  register: (data: Omit<RegisterInput, "confirmPassword" | "agreeToTerms">) =>
    api
      .post<ApiResponse<{ message: string }>>("/auth/register", data)
      .then((r) => r.data),

  verifyEmail: (token: string) =>
    api
      .post<ApiResponse<{ message: string }>>("/auth/verify-email", { token })
      .then((r) => r.data),

  resendVerification: (email: string) =>
    api
      .post<ApiResponse<{ message: string }>>("/auth/resend-verification", { email })
      .then((r) => r.data),

  forgotPassword: (email: string) =>
    api
      .post<ApiResponse<{ message: string }>>("/auth/forgot-password", { email })
      .then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api
      .post<ApiResponse<{ message: string }>>("/auth/reset-password", { token, password })
      .then((r) => r.data),

  logout: () => api.post<ApiResponse<null>>("/auth/logout").then((r) => r.data),

  getMe: () => api.get<ApiResponse<AuthUser>>("/users/me").then((r) => r.data),
};

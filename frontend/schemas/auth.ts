import { z } from "zod";

export const loginOwnerSchema = z.object({
  email: z.string().min(1, { message: "Email wajib diisi" }).email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
  rememberMe: z.boolean().optional(),
});

export const loginStaffSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  pin: z
    .string()
    .length(6, { message: "PIN harus 6 digit" })
    .regex(/^\d+$/, { message: "PIN hanya boleh angka" }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),
    phone: z
      .string()
      .min(10, { message: "Nomor HP minimal 10 digit" })
      .max(15, { message: "Nomor HP maksimal 15 digit" })
      .regex(/^\d+$/, { message: "Nomor HP hanya angka" }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .regex(/[A-Z]/, { message: "Harus ada minimal 1 huruf kapital" })
      .regex(/[0-9]/, { message: "Harus ada minimal 1 angka" }),
    confirmPassword: z.string().min(1, { message: "Konfirmasi password wajib diisi" }),
    agreeToTerms: z.literal(true, {
      message: "Kamu harus menyetujui syarat & ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" })
      .regex(/[A-Z]/, { message: "Harus ada minimal 1 huruf kapital" })
      .regex(/[0-9]/, { message: "Harus ada minimal 1 angka" }),
    confirmPassword: z.string().min(1, { message: "Konfirmasi password wajib diisi" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginOwnerInput = z.infer<typeof loginOwnerSchema>;
export type LoginStaffInput = z.infer<typeof loginStaffSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

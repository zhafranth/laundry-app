import { z } from "zod";

// ── Create Staff ──────────────────────────────────────────────────────────
export const staffCreateSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, underscore"),
  pin: z
    .string()
    .length(6, "PIN harus 6 digit")
    .regex(/^\d{6}$/, "PIN harus angka"),
  role: z.enum(["kasir", "operator"], { message: "Pilih role yang valid" }),
});

// ── Edit Staff (PIN tidak wajib) ──────────────────────────────────────────
export const staffEditSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().optional(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, underscore"),
  role: z.enum(["kasir", "operator"], { message: "Pilih role yang valid" }),
});

// ── Reset PIN ─────────────────────────────────────────────────────────────
export const resetPinSchema = z
  .object({
    pin: z
      .string()
      .length(6, "PIN harus 6 digit")
      .regex(/^\d{6}$/, "PIN harus angka"),
    confirmPin: z
      .string()
      .length(6, "Konfirmasi PIN harus 6 digit")
      .regex(/^\d{6}$/, "PIN harus angka"),
  })
  .refine((d) => d.pin === d.confirmPin, {
    message: "PIN tidak cocok",
    path: ["confirmPin"],
  });

export type StaffCreateFormValues = z.infer<typeof staffCreateSchema>;
export type StaffEditFormValues = z.infer<typeof staffEditSchema>;
export type ResetPinFormValues = z.infer<typeof resetPinSchema>;

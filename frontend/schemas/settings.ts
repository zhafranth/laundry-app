import { z } from "zod";

// ── Outlet Profile ─────────────────────────────────────────────────────────
export const outletProfileSchema = z.object({
  name: z.string().min(1, "Nama outlet wajib diisi").max(100, "Nama terlalu panjang"),
  address: z.string().max(255, "Alamat terlalu panjang").optional(),
  phone: z
    .string()
    .max(20, "Nomor telepon terlalu panjang")
    .regex(/^[0-9+\-\s()]*$/, "Format telepon tidak valid")
    .optional()
    .or(z.literal("")),
});

export type OutletProfileFormValues = z.infer<typeof outletProfileSchema>;

// ── Service (Layanan & Harga) ──────────────────────────────────────────────
export const serviceSchema = z.object({
  name: z.string().min(1, "Nama layanan wajib diisi").max(100, "Nama terlalu panjang"),
  pricePerUnit: z.number({ message: "Harga wajib diisi" }).min(0, "Harga tidak boleh negatif"),
  unit: z.enum(["kg", "pcs", "meter"], { message: "Pilih satuan yang valid" }),
  estimatedDuration: z
    .number({ message: "Estimasi durasi wajib diisi" })
    .min(0, "Durasi tidak boleh negatif"),
  isActive: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

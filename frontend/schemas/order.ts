import { z } from "zod";

const orderItemSchema = z.object({
  serviceId: z.string().min(1, { message: "Pilih layanan" }),
  qty: z.number({ message: "Qty tidak valid" }).positive({ message: "Qty harus lebih dari 0" }),
  pricePerUnit: z.number({ message: "Harga tidak valid" }).min(0, { message: "Harga tidak boleh negatif" }),
});

export const createOrderSchema = z
  .object({
    customerId: z.string().optional(),
    customerName: z.string().min(1, { message: "Nama pelanggan wajib diisi" }),
    customerPhone: z
      .string()
      .min(9, { message: "Nomor HP minimal 9 digit" })
      .max(15, { message: "Nomor HP maksimal 15 digit" })
      .regex(/^\d+$/, { message: "Nomor HP hanya angka" }),
    items: z
      .array(orderItemSchema)
      .min(1, { message: "Minimal 1 layanan harus dipilih" }),
    notes: z.string().optional(),
    estimatedFinishedAt: z.string().optional(),
    paymentStatus: z.enum(["belum_bayar", "dp", "lunas"], {
      message: "Pilih status pembayaran",
    }),
    paymentMethod: z.enum(["tunai", "transfer", "qris"]).optional(),
    paidAmount: z.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentStatus !== "belum_bayar" && !data.paymentMethod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pilih metode pembayaran",
        path: ["paymentMethod"],
      });
    }
    if (data.paymentStatus === "dp") {
      if (!data.paidAmount || data.paidAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Masukkan jumlah DP",
          path: ["paidAmount"],
        });
      }
    }
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

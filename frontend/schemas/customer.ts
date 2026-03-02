import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  phone: z
    .string()
    .min(9, { message: "Nomor HP minimal 9 digit" })
    .max(15, { message: "Nomor HP maksimal 15 digit" })
    .regex(/^\d+$/, { message: "Nomor HP hanya boleh angka" }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

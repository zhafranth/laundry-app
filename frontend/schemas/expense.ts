import { z } from "zod";

export const expenseSchema = z.object({
  expenseDate: z.string().min(1, { message: "Tanggal wajib diisi" }),
  categoryId: z.string().min(1, { message: "Pilih kategori" }),
  subcategoryId: z.string().optional(),
  amount: z.number().positive({ message: "Jumlah harus lebih dari 0" }),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringDay: z.number().min(1).max(31).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

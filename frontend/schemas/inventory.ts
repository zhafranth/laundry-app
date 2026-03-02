import { z } from "zod";

// ── Add / Edit Inventory Item ──────────────────────────────────────────────────
export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Nama item wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  currentStock: z.number({ message: "Stok saat ini wajib diisi" }).min(0, "Stok tidak boleh negatif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  minimumStock: z.number({ message: "Stok minimum wajib diisi" }).min(0, "Tidak boleh negatif"),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

// ── Restock (catat stok masuk) ─────────────────────────────────────────────────
export const restockSchema = z.object({
  qty: z.number({ message: "Jumlah wajib diisi" }).min(1, "Minimal 1"),
  unitCost: z.number().optional(),
  supplier: z.string().optional(),
  logDate: z.string().min(1, "Tanggal wajib diisi"),
  notes: z.string().optional(),
});

export type RestockFormValues = z.infer<typeof restockSchema>;

// ── Usage (catat pemakaian) ────────────────────────────────────────────────────
export const usageSchema = z.object({
  qty: z.number({ message: "Jumlah pemakaian wajib diisi" }).min(1, "Minimal 1"),
  logDate: z.string().min(1, "Tanggal wajib diisi"),
  notes: z.string().optional(),
});

export type UsageFormValues = z.infer<typeof usageSchema>;

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { expenseSchema, type ExpenseFormValues } from "@/schemas/expense";
import type { ExpenseCategory, ExpenseSubcategory } from "@/types";

interface ExpenseFormModalProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ExpenseFormValues>;
  categories: ExpenseCategory[];
  subcategories?: ExpenseSubcategory[];
  isPro: boolean;
  onSubmit: (values: ExpenseFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  borderRadius: 12,
  border: "2px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.75rem",
  color: "#3D5068",
  letterSpacing: "0.01em",
};

export function ExpenseFormModal({
  mode,
  defaultValues,
  categories,
  subcategories = [],
  isPro,
  onSubmit,
  onClose,
  isPending,
}: ExpenseFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().split("T")[0],
      categoryId: "",
      subcategoryId: "",
      amount: undefined as unknown as number,
      notes: "",
      isRecurring: false,
      recurringDay: undefined,
      ...defaultValues,
    },
  });

  const notesReg = register("notes");
  const selectedCategoryId = watch("categoryId");
  const isRecurring = watch("isRecurring");

  const filteredSubcategories = subcategories.filter(
    (sc) => sc.categoryId === selectedCategoryId
  );

  useEffect(() => {
    reset({
      expenseDate: new Date().toISOString().split("T")[0],
      categoryId: "",
      subcategoryId: "",
      amount: undefined as unknown as number,
      notes: "",
      isRecurring: false,
      recurringDay: undefined,
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full"
        style={{
          background: "white",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
          animation: "fade-up 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1.5px solid #F0F3F7" }}
        >
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1rem",
              color: "#0B1D35",
              margin: 0,
            }}
          >
            {mode === "create" ? "Catat Pengeluaran" : "Edit Pengeluaran"}
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1.5px solid #E8EDF2",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={15} color="#5A6B80" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 py-5">
          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Tanggal</label>
            <input
              type="date"
              {...register("expenseDate")}
              style={{
                ...selectStyle,
                cursor: "text",
                appearance: "auto" as React.CSSProperties["appearance"],
                WebkitAppearance: "auto" as unknown as React.CSSProperties["WebkitAppearance"],
              }}
            />
            {errors.expenseDate && (
              <p style={{ color: "#EF2D56", fontSize: "0.72rem", fontFamily: "Nunito Sans, system-ui", margin: 0 }}>
                {errors.expenseDate.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Kategori</label>
            <select {...register("categoryId")} style={selectStyle}>
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p style={{ color: "#EF2D56", fontSize: "0.72rem", fontFamily: "Nunito Sans, system-ui", margin: 0 }}>
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Subcategory (Pro only) */}
          {isPro && filteredSubcategories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Sub-kategori</label>
              <select {...register("subcategoryId")} style={selectStyle}>
                <option value="">Pilih sub-kategori</option>
                {filteredSubcategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <Input
            label="Jumlah (Rp)"
            type="number"
            placeholder="0"
            inputMode="numeric"
            error={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label style={labelStyle}>Catatan (opsional)</label>
            <textarea
              placeholder="Catatan tambahan..."
              rows={3}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 12,
                border: "2px solid #E8EDF2",
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 500,
                fontSize: "0.8125rem",
                color: "#0B1D35",
                background: "white",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
              {...notesReg}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E8EDF2";
                notesReg.onBlur(e);
              }}
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isRecurring"
              {...register("isRecurring")}
              style={{ width: 18, height: 18, accentColor: "#00B4D8", cursor: "pointer" }}
            />
            <label
              htmlFor="isRecurring"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#1A2D45",
                cursor: "pointer",
              }}
            >
              Pengeluaran berulang (bulanan)
            </label>
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Tanggal berulang setiap bulan</label>
              <select {...register("recurringDay", { valueAsNumber: true })} style={selectStyle}>
                <option value="">Pilih tanggal</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tanggal {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={isPending}>
              {mode === "create" ? "Simpan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

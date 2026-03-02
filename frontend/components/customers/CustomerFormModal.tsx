"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { customerSchema, type CustomerFormValues } from "@/schemas/customer";
import type { Customer } from "@/types";

interface CustomerFormModalProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CustomerFormValues>;
  editTarget?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export function CustomerFormModal({
  mode,
  defaultValues,
  onSubmit,
  onClose,
  isPending,
}: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
      ...defaultValues,
    },
  });

  const notesReg = register("notes");

  // Sync defaultValues when switching edit targets
  useEffect(() => {
    reset({
      name: "",
      phone: "",
      address: "",
      notes: "",
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
          maxWidth: 460,
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
            {mode === "create" ? "Tambah Pelanggan" : "Edit Pelanggan"}
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
          <Input
            label="Nama Pelanggan"
            placeholder="Contoh: Budi Santoso"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Nomor HP"
            placeholder="Contoh: 08123456789"
            inputMode="numeric"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Alamat (opsional)"
            placeholder="Contoh: Jl. Mawar No. 5"
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "#3D5068",
                letterSpacing: "0.01em",
              }}
            >
              Catatan (opsional)
            </label>
            <textarea
              placeholder="Catatan khusus tentang pelanggan ini..."
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

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={onClose}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={isPending}>
              {mode === "create" ? "Simpan Pelanggan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

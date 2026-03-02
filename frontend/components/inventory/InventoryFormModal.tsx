import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { inventoryItemSchema, type InventoryItemFormValues } from "@/schemas/inventory";
import { Button } from "@/components/ui/Button";
import type { InventoryItem } from "@/types";

const PRESET_CATEGORIES = [
  "Bahan Cuci",
  "Pewangi & Softener",
  "Kemasan",
  "Peralatan",
  "Lain-lain",
];

const PRESET_UNITS = ["liter", "kg", "botol", "pcs", "rol", "pak", "dus"];

interface Props {
  mode: "create" | "edit";
  defaultValues?: Partial<InventoryItem>;
  onSubmit: (values: InventoryItemFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

const FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 12px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  background: "white",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box" as const,
};

export function InventoryFormModal({ mode, defaultValues, onSubmit, onClose, isPending }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "",
      currentStock: 0,
      unit: "",
      minimumStock: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        category: defaultValues.category ?? "",
        currentStock: defaultValues.currentStock ?? 0,
        unit: defaultValues.unit ?? "",
        minimumStock: defaultValues.minimumStock ?? 0,
      });
    }
  }, [mode, defaultValues, reset]);

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
          margin: "0 16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1.5px solid #E8EDF2" }}
        >
          <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", margin: 0 }}>
            {mode === "create" ? "Tambah Item Inventory" : "Edit Item Inventory"}
          </p>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#8899AA", display: "flex", padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
          {/* Nama Item */}
          <div>
            <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
              Nama Item <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              {...register("name")}
              placeholder="cth: Deterjen Cair"
              style={FIELD_STYLE}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? "#EF4444" : "#E8EDF2")}
            />
            {errors.name && (
              <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
              Kategori <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              {...register("category")}
              style={{ ...FIELD_STYLE, cursor: "pointer" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.category ? "#EF4444" : "#E8EDF2")}
            >
              <option value="">Pilih kategori</option>
              {PRESET_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && (
              <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Stok Saat Ini + Satuan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
                Stok Saat Ini <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                {...register("currentStock", { valueAsNumber: true })}
                min={0}
                step="0.1"
                style={FIELD_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.currentStock ? "#EF4444" : "#E8EDF2")}
              />
              {errors.currentStock && (
                <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                  {errors.currentStock.message}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
                Satuan <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <select
                {...register("unit")}
                style={{ ...FIELD_STYLE, cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.unit ? "#EF4444" : "#E8EDF2")}
              >
                <option value="">Pilih satuan</option>
                {PRESET_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.unit && (
                <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          {/* Stok Minimum */}
          <div>
            <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
              Stok Minimum <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="number"
              {...register("minimumStock", { valueAsNumber: true })}
              min={0}
              step="0.1"
              style={FIELD_STYLE}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.minimumStock ? "#EF4444" : "#E8EDF2")}
            />
            <p style={{ fontFamily: "Nunito Sans", fontSize: "0.72rem", color: "#8899AA", marginTop: 4 }}>
              Alert otomatis saat stok mencapai nilai ini
            </p>
            {errors.minimumStock && (
              <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                {errors.minimumStock.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" fullWidth type="button" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button variant="primary" fullWidth loading={isPending} type="submit">
              {mode === "create" ? "Tambah Item" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

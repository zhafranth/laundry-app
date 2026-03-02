import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, TrendingDown } from "lucide-react";
import { usageSchema, type UsageFormValues } from "@/schemas/inventory";
import { Button } from "@/components/ui/Button";
import type { InventoryItem } from "@/types";

interface Props {
  item: InventoryItem;
  onSubmit: (values: UsageFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

const today = new Date().toISOString().slice(0, 10);

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

export function UsageModal({ item, onSubmit, onClose, isPending }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsageFormValues>({
    resolver: zodResolver(usageSchema),
    defaultValues: { logDate: today },
  });

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
          maxWidth: 400,
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
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(124,58,237,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingDown size={16} color="#7C3AED" />
            </div>
            <div>
              <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "0.9375rem", color: "#0B1D35", margin: 0 }}>
                Catat Pemakaian
              </p>
              <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.75rem", color: "#8899AA", margin: 0 }}>
                {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#8899AA", display: "flex", padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current stock info */}
        <div
          className="mx-6 mt-4 px-4 py-3 rounded-xl"
          style={{ background: "#F5F7FA", border: "1.5px solid #E8EDF2" }}
        >
          <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80", margin: 0 }}>
            Stok saat ini:{" "}
            <strong style={{ color: "#0B1D35" }}>
              {item.currentStock.toLocaleString("id-ID")} {item.unit}
            </strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
          {/* Qty + Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
                Qty Pemakaian ({item.unit}) <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="number"
                {...register("qty", { valueAsNumber: true })}
                min={1}
                step="0.1"
                placeholder="0"
                style={FIELD_STYLE}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.qty ? "#EF4444" : "#E8EDF2")}
              />
              {errors.qty && (
                <p style={{ fontFamily: "Nunito Sans", fontSize: "0.75rem", color: "#EF4444", marginTop: 4 }}>
                  {errors.qty.message}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
                Tanggal <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="date"
                {...register("logDate")}
                style={{ ...FIELD_STYLE, cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label style={{ display: "block", fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", marginBottom: 6 }}>
              Catatan
              <span style={{ color: "#8899AA", fontWeight: 500, marginLeft: 4 }}>opsional</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Catatan pemakaian..."
              rows={2}
              style={{
                ...FIELD_STYLE,
                height: "auto",
                padding: "10px 12px",
                resize: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" fullWidth type="button" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button
              fullWidth
              loading={isPending}
              type="submit"
              style={{ background: "#7C3AED", color: "white", border: "none" }}
            >
              Catat Pemakaian
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

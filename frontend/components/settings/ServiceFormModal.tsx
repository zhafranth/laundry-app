import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { serviceSchema, type ServiceFormValues } from "@/schemas/settings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Service } from "@/types";

interface ServiceFormModalProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

const UNIT_OPTIONS: { label: string; value: Service["unit"] }[] = [
  { label: "kg", value: "kg" },
  { label: "pcs", value: "pcs" },
  { label: "meter", value: "meter" },
];

export function ServiceFormModal({
  mode,
  defaultValues,
  onSubmit,
  onClose,
  isPending,
}: ServiceFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      pricePerUnit: 0,
      unit: "kg",
      estimatedDuration: 24,
      isActive: true,
      ...defaultValues,
    },
  });

  const isActive = watch("isActive");
  const selectedUnit = watch("unit");

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([k, v]) => {
        if (v !== undefined) setValue(k as keyof ServiceFormValues, v as never);
      });
    }
  }, []);

  const priceReg = register("pricePerUnit", { valueAsNumber: true });
  const durationReg = register("estimatedDuration", { valueAsNumber: true });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full mx-4"
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
          style={{ borderBottom: "1.5px solid #E8EDF2" }}
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
            {mode === "create" ? "Tambah Layanan" : "Edit Layanan"}
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "#F5F7FA",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5A6B80",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-4 px-6 py-5">
            {/* Nama */}
            <Input
              label="Nama Layanan"
              placeholder="Cth: Cuci Kiloan Reguler"
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Harga + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: errors.pricePerUnit ? "#EF2D56" : "#3D5068",
                  }}
                >
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  placeholder="0"
                  {...priceReg}
                  style={{
                    height: 48,
                    padding: "0 16px",
                    borderRadius: 12,
                    border: `2px solid ${errors.pricePerUnit ? "#EF2D56" : "#E8EDF2"}`,
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: "#0B1D35",
                    background: "white",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    if (!errors.pricePerUnit) e.currentTarget.style.borderColor = "#00B4D8";
                    e.currentTarget.style.boxShadow = errors.pricePerUnit
                      ? "0 0 0 3px rgba(239,45,86,0.12)"
                      : "0 0 0 3px rgba(0,180,216,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.pricePerUnit ? "#EF2D56" : "#E8EDF2";
                    e.currentTarget.style.boxShadow = "none";
                    priceReg.onBlur(e);
                  }}
                />
                {errors.pricePerUnit && (
                  <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.75rem", color: "#EF2D56", margin: 0 }}>
                    {errors.pricePerUnit.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: errors.unit ? "#EF2D56" : "#3D5068",
                  }}
                >
                  Satuan
                </label>
                <select
                  {...register("unit")}
                  value={selectedUnit}
                  onChange={(e) => setValue("unit", e.target.value as Service["unit"])}
                  style={{
                    height: 48,
                    padding: "0 16px",
                    borderRadius: 12,
                    border: `2px solid ${errors.unit ? "#EF2D56" : "#E8EDF2"}`,
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: "#0B1D35",
                    background: "white",
                    outline: "none",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.75rem", color: "#EF2D56", margin: 0 }}>
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            {/* Durasi Estimasi */}
            <div className="flex flex-col gap-1.5">
              <label
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: errors.estimatedDuration ? "#EF2D56" : "#3D5068",
                }}
              >
                Estimasi Durasi (jam)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                placeholder="24"
                {...durationReg}
                style={{
                  height: 48,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: `2px solid ${errors.estimatedDuration ? "#EF2D56" : "#E8EDF2"}`,
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  color: "#0B1D35",
                  background: "white",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  if (!errors.estimatedDuration) e.currentTarget.style.borderColor = "#00B4D8";
                  e.currentTarget.style.boxShadow = errors.estimatedDuration
                    ? "0 0 0 3px rgba(239,45,86,0.12)"
                    : "0 0 0 3px rgba(0,180,216,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.estimatedDuration ? "#EF2D56" : "#E8EDF2";
                  e.currentTarget.style.boxShadow = "none";
                  durationReg.onBlur(e);
                }}
              />
              {errors.estimatedDuration && (
                <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.75rem", color: "#EF2D56", margin: 0 }}>
                  {errors.estimatedDuration.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#F5F7FA", border: "1.5px solid #E8EDF2" }}>
              <div>
                <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: "#0B1D35", margin: 0 }}>
                  Status Layanan
                </p>
                <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.78rem", color: "#8899AA", margin: "2px 0 0" }}>
                  {isActive ? "Layanan aktif dan bisa dipilih saat buat order" : "Layanan nonaktif, tidak muncul saat buat order"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  background: isActive ? "#00B4D8" : "#C4CDD6",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "white",
                    top: 3,
                    left: isActive ? 23 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex gap-3 px-6 pb-5"
            style={{ borderTop: "1.5px solid #E8EDF2", paddingTop: 16 }}
          >
            <Button variant="ghost" fullWidth type="button" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button variant="primary" fullWidth type="submit" loading={isPending}>
              {mode === "create" ? "Tambah Layanan" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

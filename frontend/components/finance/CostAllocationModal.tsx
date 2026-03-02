"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CostAllocation } from "@/types";

interface CostAllocationModalProps {
  allocations: CostAllocation[];
  onSubmit: (allocations: CostAllocation[]) => void;
  onClose: () => void;
  isPending: boolean;
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.75rem",
  color: "#3D5068",
  letterSpacing: "0.01em",
};

export function CostAllocationModal({
  allocations: initial,
  onSubmit,
  onClose,
  isPending,
}: CostAllocationModalProps) {
  const [allocations, setAllocations] = useState<CostAllocation[]>(
    initial.map((a) => ({ ...a }))
  );

  const total = allocations.reduce((s, a) => s + a.allocationPercent, 0);
  const isValid = total === 100;

  function handleChange(serviceId: string, value: number) {
    setAllocations((prev) =>
      prev.map((a) =>
        a.serviceId === serviceId ? { ...a, allocationPercent: value } : a
      )
    );
  }

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
            Atur Alokasi Biaya
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

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <p
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.8125rem",
              color: "#5A6B80",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Tentukan persentase alokasi biaya operasional untuk setiap layanan. Total harus 100%.
          </p>

          {allocations.map((a) => (
            <div key={a.serviceId} className="flex items-center justify-between gap-4">
              <label style={{ ...labelStyle, flex: 1, fontSize: "0.8125rem" }}>
                {a.serviceName}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={a.allocationPercent}
                  onChange={(e) => handleChange(a.serviceId, Number(e.target.value) || 0)}
                  style={{
                    width: 72,
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 10,
                    border: "1.5px solid #E8EDF2",
                    background: "white",
                    fontFamily: "Nunito Sans, system-ui",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: "#0B1D35",
                    outline: "none",
                    textAlign: "right" as const,
                  }}
                />
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    color: "#8899AA",
                  }}
                >
                  %
                </span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: isValid ? "rgba(0,200,83,0.06)" : "rgba(239,45,86,0.06)",
              border: `1px solid ${isValid ? "rgba(0,200,83,0.15)" : "rgba(239,45,86,0.15)"}`,
            }}
          >
            <span
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.8125rem",
                color: isValid ? "#00C853" : "#EF2D56",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
                color: isValid ? "#00C853" : "#EF2D56",
              }}
            >
              {total}%
            </span>
          </div>

          {!isValid && (
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.75rem",
                color: "#EF2D56",
                margin: 0,
              }}
            >
              Total alokasi harus tepat 100%. Saat ini: {total}%
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              disabled={!isValid || isPending}
              loading={isPending}
              onClick={() => onSubmit(allocations)}
            >
              Simpan Alokasi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

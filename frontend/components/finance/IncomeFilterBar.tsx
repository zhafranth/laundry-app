"use client";

import { X, Filter } from "lucide-react";
import type { IncomeFilterState } from "@/hooks/useFinanceFilters";

const PAYMENT_OPTIONS = [
  { value: "", label: "Semua Metode" },
  { value: "tunai", label: "Tunai" },
  { value: "transfer", label: "Transfer" },
  { value: "qris", label: "QRIS" },
];

interface IncomeFilterBarProps {
  filters: IncomeFilterState;
  onFilterChange: <K extends keyof IncomeFilterState>(
    key: K,
    value: IncomeFilterState[K]
  ) => void;
  onReset: () => void;
}

const selectStyle: React.CSSProperties = {
  height: 40,
  padding: "0 12px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 600,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: 32,
  minWidth: 140,
};

const dateInputStyle: React.CSSProperties = {
  height: 40,
  padding: "0 10px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  outline: "none",
};

export function IncomeFilterBar({
  filters,
  onFilterChange,
  onReset,
}: IncomeFilterBarProps) {
  const hasActiveFilters =
    filters.paymentMethod || filters.dateFrom || filters.dateTo || filters.serviceId;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "white",
        border: "1.5px solid #E8EDF2",
        boxShadow: "0 2px 8px rgba(11,29,53,0.06)",
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Payment method */}
        <div className="relative">
          <select
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
            style={selectStyle}
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Filter
            size={13}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8899AA",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Date from */}
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#8899AA",
            }}
          >
            Dari
          </span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            style={dateInputStyle}
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#8899AA",
            }}
          >
            S/d
          </span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            style={dateInputStyle}
          />
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5"
            style={{
              height: 40,
              padding: "0 12px",
              borderRadius: 10,
              border: "1.5px solid #E8EDF2",
              background: "white",
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#EF2D56",
              cursor: "pointer",
            }}
          >
            <X size={13} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

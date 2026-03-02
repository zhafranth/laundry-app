"use client";

import { useEffect, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import type { OrderFilterState } from "@/hooks/useOrderFilters";

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "masuk", label: "Masuk" },
  { value: "proses", label: "Proses" },
  { value: "siap_diambil", label: "Siap Diambil" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

interface OrderFilterBarProps {
  filters: OrderFilterState;
  onFilterChange: <K extends keyof OrderFilterState>(
    key: K,
    value: OrderFilterState[K]
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

const inputStyle: React.CSSProperties = {
  height: 40,
  padding: "0 12px 0 36px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  outline: "none",
  minWidth: 200,
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

export function OrderFilterBar({
  filters,
  onFilterChange,
  onReset,
}: OrderFilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onFilterChange("search", debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line

  const hasActiveFilters =
    filters.status || filters.search || filters.dateFrom || filters.dateTo;

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
        {/* Search */}
        <div className="relative" style={{ minWidth: 220 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8899AA",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Cari pelanggan / nomor order..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            style={selectStyle}
          >
            {STATUS_OPTIONS.map((opt) => (
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
            onClick={() => {
              setSearchInput("");
              onReset();
            }}
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

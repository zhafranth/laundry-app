import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye, Pencil, Trash2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Customer } from "@/types";
import type { CustomerSortField, SortOrder } from "@/services/customer";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  sortBy: CustomerSortField;
  sortOrder: SortOrder;
  onSort: (field: CustomerSortField) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  isOwner: boolean;
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: CustomerSortField;
  sortBy: CustomerSortField;
  sortOrder: SortOrder;
}) {
  if (sortBy !== field) return <ChevronsUpDown size={13} color="#C4CDD6" />;
  return sortOrder === "asc" ? (
    <ChevronUp size={13} color="#00B4D8" />
  ) : (
    <ChevronDown size={13} color="#00B4D8" />
  );
}

const COLS: { label: string; field: CustomerSortField | null; width?: number }[] = [
  { label: "Pelanggan", field: "name" },
  { label: "Total Order", field: "totalOrders", width: 120 },
  { label: "Total Spending", field: "totalSpending", width: 150 },
  { label: "Terakhir Order", field: "lastOrderAt", width: 140 },
  { label: "Aksi", field: null, width: 120 },
];

export function CustomerTable({
  customers,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  isOwner,
}: CustomerTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5"
            style={{
              height: 64,
              borderBottom: i < 4 ? "1px solid #F0F3F7" : "none",
            }}
          >
            <Skeleton style={{ width: 36, height: 36, borderRadius: 9999 }} />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton style={{ width: 140, height: 12 }} />
              <Skeleton style={{ width: 100, height: 10 }} />
            </div>
            <Skeleton style={{ width: 60, height: 12 }} />
            <Skeleton style={{ width: 90, height: 12 }} />
            <Skeleton style={{ width: 90, height: 12 }} />
            <Skeleton style={{ width: 80, height: 28, borderRadius: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div
        className="rounded-2xl flex flex-col items-center justify-center"
        style={{
          border: "1.5px solid #E8EDF2",
          background: "white",
          minHeight: 240,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(0,180,216,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Users size={24} color="#00B4D8" />
        </div>
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#0B1D35",
            margin: 0,
          }}
        >
          Belum ada pelanggan
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8rem",
            color: "#8899AA",
            margin: 0,
          }}
        >
          Tambah pelanggan pertama untuk mulai
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #E8EDF2", background: "white" }}
    >
      {/* Table header */}
      <div
        className="flex items-center px-5"
        style={{
          height: 44,
          background: "#F5F7FA",
          borderBottom: "1.5px solid #E8EDF2",
        }}
      >
        {COLS.map((col) => (
          <div
            key={col.label}
            style={{
              flex: col.width ? `0 0 ${col.width}px` : 1,
              width: col.width,
            }}
          >
            {col.field ? (
              <button
                type="button"
                onClick={() => onSort(col.field!)}
                className="flex items-center gap-1"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: sortBy === col.field ? "#00B4D8" : "#8899AA",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {col.label}
                <SortIcon field={col.field} sortBy={sortBy} sortOrder={sortOrder} />
              </button>
            ) : (
              <span
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  color: "#8899AA",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {col.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Rows */}
      {customers.map((customer, i) => (
        <div
          key={customer.id}
          className="flex items-center px-5"
          style={{
            height: 68,
            borderBottom: i < customers.length - 1 ? "1px solid #F0F3F7" : "none",
          }}
        >
          {/* Name + phone */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <button
              type="button"
              onClick={() => navigate(`/customers/${customer.id}`)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#0B1D35",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 220,
                }}
              >
                {customer.name}
              </p>
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.78rem",
                  color: "#8899AA",
                  margin: 0,
                  marginTop: 2,
                }}
              >
                {customer.phone}
              </p>
            </button>
          </div>

          {/* Total order */}
          <div style={{ flex: "0 0 120px" }}>
            <span
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#0B1D35",
              }}
            >
              {customer.totalOrders}
            </span>
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.75rem",
                color: "#8899AA",
                marginLeft: 4,
              }}
            >
              order
            </span>
          </div>

          {/* Total spending */}
          <div style={{ flex: "0 0 150px" }}>
            <span
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: customer.totalSpending > 0 ? "#0B1D35" : "#8899AA",
              }}
            >
              {formatRupiah(customer.totalSpending)}
            </span>
          </div>

          {/* Last order */}
          <div style={{ flex: "0 0 140px" }}>
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8125rem",
                color: "#5A6B80",
              }}
            >
              {formatDate(customer.lastOrderAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1" style={{ flex: "0 0 120px" }}>
            <button
              type="button"
              title="Lihat detail"
              onClick={() => navigate(`/customers/${customer.id}`)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                background: "rgba(0,180,216,0.08)",
                color: "#00B4D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Eye size={14} />
            </button>

            {isOwner && (
              <>
                <button
                  type="button"
                  title="Edit pelanggan"
                  onClick={() => onEdit(customer)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "none",
                    background: "rgba(124,77,255,0.08)",
                    color: "#7C4DFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  title="Hapus pelanggan"
                  onClick={() => onDelete(customer)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "none",
                    background: "rgba(239,45,86,0.08)",
                    color: "#EF2D56",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

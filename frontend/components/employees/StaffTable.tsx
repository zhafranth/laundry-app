import { ChevronUp, ChevronDown, ChevronsUpDown, Edit2, KeyRound, Power, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Staff } from "@/types";
import type { StaffSortField, SortOrder } from "@/services/employee";

const ROLE_LABEL: Record<string, string> = {
  kasir: "Kasir",
  operator: "Operator",
};

function SortIcon({ field, sortBy, sortOrder }: { field: StaffSortField; sortBy: StaffSortField; sortOrder: SortOrder }) {
  if (sortBy !== field) return <ChevronsUpDown size={13} style={{ color: "#C4CDD6", flexShrink: 0 }} />;
  return sortOrder === "asc"
    ? <ChevronUp size={13} style={{ color: "#00B4D8", flexShrink: 0 }} />
    : <ChevronDown size={13} style={{ color: "#00B4D8", flexShrink: 0 }} />;
}

function SkeletonRow() {
  return (
    <tr>
      {[180, 130, 90, 110, 100, 110, 120].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <Skeleton style={{ width: w, height: 14, borderRadius: 6 }} />
        </td>
      ))}
    </tr>
  );
}

interface StaffTableProps {
  staff: Staff[];
  isLoading: boolean;
  sortBy: StaffSortField;
  sortOrder: SortOrder;
  onSort: (field: StaffSortField) => void;
  onEdit: (s: Staff) => void;
  onResetPin: (s: Staff) => void;
  onToggleActive: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

const TH_STYLE: React.CSSProperties = {
  background: "#F5F7FA",
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.72rem",
  color: "#5A6B80",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  padding: "11px 16px",
  textAlign: "left",
  whiteSpace: "nowrap",
  userSelect: "none",
};

export function StaffTable({
  staff,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onResetPin,
  onToggleActive,
  onDelete,
}: StaffTableProps) {
  function formatLastLogin(dateStr: string | null) {
    if (!dateStr) return <span style={{ color: "#C4CDD6", fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem" }}>Belum pernah</span>;
    const d = new Date(dateStr);
    return (
      <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80" }}>
        {d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })},{" "}
        {d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
      </span>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #E8EDF2" }}>
              {/* Nama — sortable */}
              <th
                style={{ ...TH_STYLE, cursor: "pointer" }}
                onClick={() => onSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  Nama
                  <SortIcon field="name" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th style={TH_STYLE}>Username</th>
              {/* Role — sortable */}
              <th
                style={{ ...TH_STYLE, cursor: "pointer" }}
                onClick={() => onSort("role")}
              >
                <div className="flex items-center gap-1.5">
                  Role
                  <SortIcon field="role" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th style={TH_STYLE}>Nomor HP</th>
              <th style={TH_STYLE}>Status</th>
              <th style={TH_STYLE}>Terakhir Login</th>
              <th style={{ ...TH_STYLE, textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,180,216,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.9rem", color: "#0B1D35", margin: 0 }}>
                      Belum ada karyawan
                    </p>
                    <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#8899AA", margin: 0, textAlign: "center" }}>
                      Tambah karyawan pertama kamu untuk mulai mengelola tim.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              staff.map((s, idx) => (
                <StaffRow
                  key={s.id}
                  staff={s}
                  isLast={idx === staff.length - 1}
                  formatLastLogin={formatLastLogin}
                  onEdit={onEdit}
                  onResetPin={onResetPin}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffRow({
  staff: s,
  isLast,
  formatLastLogin,
  onEdit,
  onResetPin,
  onToggleActive,
  onDelete,
}: {
  staff: Staff;
  isLast: boolean;
  formatLastLogin: (d: string | null) => React.ReactNode;
  onEdit: (s: Staff) => void;
  onResetPin: (s: Staff) => void;
  onToggleActive: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}) {
  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderBottom: isLast ? "none" : "1.5px solid #F0F3F7",
    verticalAlign: "middle",
  };

  return (
    <tr>
      {/* Nama + initial */}
      <td style={tdStyle}>
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: s.isActive ? "rgba(0,180,216,0.10)" : "rgba(196,205,214,0.20)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.72rem",
              color: s.isActive ? "#00B4D8" : "#8899AA",
            }}>
              {s.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: s.isActive ? "#0B1D35" : "#8899AA" }}>
            {s.name}
          </span>
        </div>
      </td>

      {/* Username */}
      <td style={tdStyle}>
        <span style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.8125rem", color: "#3D5068" }}>
          @{s.username}
        </span>
      </td>

      {/* Role badge */}
      <td style={tdStyle}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          height: 22,
          paddingInline: 10,
          borderRadius: 999,
          background: s.role === "kasir" ? "rgba(0,180,216,0.12)" : "rgba(255,183,3,0.15)",
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.72rem",
          color: s.role === "kasir" ? "#0077B6" : "#B88000",
        }}>
          {ROLE_LABEL[s.role] ?? s.role}
        </span>
      </td>

      {/* Phone */}
      <td style={tdStyle}>
        <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80" }}>
          {s.phone ?? <span style={{ color: "#C4CDD6" }}>—</span>}
        </span>
      </td>

      {/* Status */}
      <td style={tdStyle}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          height: 22,
          paddingInline: 10,
          borderRadius: 999,
          background: s.isActive ? "rgba(0,200,83,0.12)" : "rgba(239,45,86,0.10)",
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.72rem",
          color: s.isActive ? "#007A35" : "#C01A3A",
        }}>
          {s.isActive ? "Aktif" : "Nonaktif"}
        </span>
      </td>

      {/* Last login */}
      <td style={tdStyle}>{formatLastLogin(s.lastLoginAt)}</td>

      {/* Actions */}
      <td style={{ ...tdStyle, textAlign: "right" }}>
        <div className="flex items-center justify-end gap-1">
          <ActionBtn title="Edit" color="#00B4D8" bg="rgba(0,180,216,0.08)" hoverBg="rgba(0,180,216,0.15)" onClick={() => onEdit(s)}>
            <Edit2 size={14} />
          </ActionBtn>
          <ActionBtn title="Reset PIN" color="#FFB703" bg="rgba(255,183,3,0.10)" hoverBg="rgba(255,183,3,0.20)" onClick={() => onResetPin(s)}>
            <KeyRound size={14} />
          </ActionBtn>
          <ActionBtn
            title={s.isActive ? "Nonaktifkan" : "Aktifkan"}
            color={s.isActive ? "#8899AA" : "#00C853"}
            bg={s.isActive ? "rgba(136,153,170,0.10)" : "rgba(0,200,83,0.10)"}
            hoverBg={s.isActive ? "rgba(136,153,170,0.20)" : "rgba(0,200,83,0.20)"}
            onClick={() => onToggleActive(s)}
          >
            <Power size={14} />
          </ActionBtn>
          <ActionBtn title="Hapus" color="#EF2D56" bg="rgba(239,45,86,0.08)" hoverBg="rgba(239,45,86,0.15)" onClick={() => onDelete(s)}>
            <Trash2 size={14} />
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({
  children,
  title,
  color,
  bg,
  hoverBg,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  color: string;
  bg: string;
  hoverBg: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "none",
        background: bg,
        color,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
    >
      {children}
    </button>
  );
}

import { Clock, LogIn, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { Attendance } from "@/types";

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return <span style={{ color: "#C4CDD6" }}>—</span>;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}j ${m}m` : `${h}j`;
}

function SkeletonRow() {
  return (
    <tr>
      {[120, 140, 90, 90, 80, 90].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <Skeleton style={{ width: w, height: 14, borderRadius: 6 }} />
        </td>
      ))}
    </tr>
  );
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
};

interface AttendanceTableProps {
  records: Attendance[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  // optional: summary
  totalDays?: number;
  totalHours?: number;
}

export function AttendanceTable({
  records,
  isLoading,
  page,
  totalPages,
  onPageChange,
  totalDays,
  totalHours,
}: AttendanceTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary chips */}
      {(totalDays !== undefined || totalHours !== undefined) && (
        <div className="flex items-center gap-3 flex-wrap">
          {totalDays !== undefined && (
            <div className="flex items-center gap-2 rounded-xl px-4" style={{ height: 38, background: "rgba(0,180,216,0.08)", border: "1.5px solid rgba(0,180,216,0.15)" }}>
              <Clock size={14} color="#00B4D8" />
              <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: "#0077B6" }}>
                {totalDays} hari kerja bulan ini
              </span>
            </div>
          )}
          {totalHours !== undefined && (
            <div className="flex items-center gap-2 rounded-xl px-4" style={{ height: 38, background: "rgba(0,200,83,0.08)", border: "1.5px solid rgba(0,200,83,0.15)" }}>
              <Clock size={14} color="#00C853" />
              <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: "#007A35" }}>
                {totalHours}j total bulan ini
              </span>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #E8EDF2" }}>
                <th style={TH_STYLE}>Tanggal</th>
                <th style={TH_STYLE}>Karyawan</th>
                <th style={TH_STYLE}>
                  <div className="flex items-center gap-1.5">
                    <LogIn size={12} />
                    Masuk
                  </div>
                </th>
                <th style={TH_STYLE}>
                  <div className="flex items-center gap-1.5">
                    <LogOut size={12} />
                    Keluar
                  </div>
                </th>
                <th style={TH_STYLE}>Durasi</th>
                <th style={TH_STYLE}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,180,216,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Clock size={20} color="#00B4D8" />
                      </div>
                      <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.875rem", color: "#0B1D35", margin: 0 }}>
                        Belum ada data absensi
                      </p>
                      <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#8899AA", margin: 0 }}>
                        Absensi akan muncul setelah karyawan clock-in.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((rec, idx) => (
                  <AttendanceRow key={rec.id} record={rec} isLast={idx === records.length - 1} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

function AttendanceRow({ record: r, isLast }: { record: Attendance; isLast: boolean }) {
  const isComplete = !!r.clockOut;
  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderBottom: isLast ? "none" : "1.5px solid #F0F3F7",
    verticalAlign: "middle",
  };

  return (
    <tr>
      <td style={tdStyle}>
        <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#3D5068", fontWeight: 600 }}>
          {formatDate(r.date)}
        </span>
      </td>
      <td style={tdStyle}>
        <div className="flex items-center gap-2">
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(0,180,216,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "0.65rem", color: "#00B4D8" }}>
              {r.staffName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8125rem", color: "#0B1D35" }}>
            {r.staffName}
          </span>
        </div>
      </td>
      <td style={tdStyle}>
        <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#0B1D35", fontWeight: 600 }}>
          {formatTime(r.clockIn)}
        </span>
      </td>
      <td style={tdStyle}>
        {r.clockOut ? (
          <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#0B1D35", fontWeight: 600 }}>
            {formatTime(r.clockOut)}
          </span>
        ) : (
          <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#FFB703", fontWeight: 600 }}>
            Masih bekerja
          </span>
        )}
      </td>
      <td style={tdStyle}>
        <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80" }}>
          {formatDuration(r.workDurationMinutes)}
        </span>
      </td>
      <td style={tdStyle}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          height: 22,
          paddingInline: 10,
          borderRadius: 999,
          background: isComplete ? "rgba(0,200,83,0.12)" : "rgba(255,183,3,0.15)",
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.72rem",
          color: isComplete ? "#007A35" : "#B88000",
        }}>
          {isComplete ? "Selesai" : "Aktif"}
        </span>
      </td>
    </tr>
  );
}

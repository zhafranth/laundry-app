import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, Clock } from "lucide-react";
import { employeeService } from "@/services/employee";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store";
import { Skeleton } from "@/components/ui/Skeleton";

function formatTime(isoStr?: string) {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function StaffClockWidget() {
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.staff.attendance(activeOutletId ?? "", {}),
    queryFn: () => employeeService.getTodayStatus(activeOutletId!),
    enabled: !!activeOutletId,
    staleTime: 30_000,
  });

  const status = data?.data;
  const isClockedIn = status?.isClockedIn ?? false;

  const { mutate: clockIn, isPending: isClockingIn } = useMutation({
    mutationFn: () => employeeService.clockIn(activeOutletId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.attendance(activeOutletId ?? "", {}) });
    },
  });

  const { mutate: clockOut, isPending: isClockingOut } = useMutation({
    mutationFn: () => employeeService.clockOut(activeOutletId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.attendance(activeOutletId ?? "", {}) });
    },
  });

  const isPending = isClockingIn || isClockingOut;

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
        <Skeleton style={{ width: 44, height: 44, borderRadius: 12 }} />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton style={{ width: 140, height: 14, borderRadius: 6 }} />
          <Skeleton style={{ width: 100, height: 12, borderRadius: 5 }} />
        </div>
        <Skeleton style={{ width: 110, height: 38, borderRadius: 10 }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
      style={{ border: "1.5px solid #E8EDF2", background: "white", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}
    >
      {/* Left: icon + info */}
      <div className="flex items-center gap-3">
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: isClockedIn ? "rgba(0,200,83,0.10)" : "rgba(0,180,216,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Clock size={20} color={isClockedIn ? "#00C853" : "#00B4D8"} />
        </div>

        <div>
          <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "0.9rem", color: "#0B1D35", margin: 0 }}>
            {isClockedIn ? "Sedang Bekerja" : "Belum Clock-In Hari Ini"}
          </p>
          {isClockedIn && status?.clockIn && (
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", margin: "2px 0 0" }}>
              Masuk pukul {formatTime(status.clockIn)}
              {status.clockOut && ` · Keluar pukul ${formatTime(status.clockOut)}`}
            </p>
          )}
          {!isClockedIn && !status?.clockOut && (
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", margin: "2px 0 0" }}>
              Tap tombol untuk memulai shift kamu.
            </p>
          )}
          {status?.clockOut && (
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", margin: "2px 0 0" }}>
              Shift selesai pukul {formatTime(status.clockOut)}. Kerja bagus!
            </p>
          )}
        </div>
      </div>

      {/* Right: action button */}
      {!status?.clockOut && (
        <button
          onClick={() => (isClockedIn ? clockOut() : clockIn())}
          disabled={isPending}
          style={{
            height: 40,
            paddingInline: 20,
            borderRadius: 10,
            border: "none",
            background: isClockedIn
              ? "rgba(239,45,86,0.10)"
              : "linear-gradient(135deg, #00B4D8, #0077B6)",
            color: isClockedIn ? "#EF2D56" : "white",
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8125rem",
            cursor: isPending ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: isPending ? 0.7 : 1,
            transition: "opacity 0.15s",
            boxShadow: isClockedIn ? "none" : "0 4px 12px rgba(0,180,216,0.25)",
            flexShrink: 0,
          }}
        >
          {isClockedIn ? (
            <>
              <LogOut size={15} />
              {isPending ? "Menyimpan..." : "Clock-Out"}
            </>
          ) : (
            <>
              <LogIn size={15} />
              {isPending ? "Menyimpan..." : "Clock-In"}
            </>
          )}
        </button>
      )}
    </div>
  );
}

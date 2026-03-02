import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, UserCog, CalendarDays } from "lucide-react";

import { useAuthStore } from "@/store";
import { employeeService } from "@/services/employee";
import { queryKeys } from "@/lib/query-keys";
import { useStaffFilters } from "@/hooks/useStaffFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { StaffTable } from "@/components/employees/StaffTable";
import { StaffFormModal } from "@/components/employees/StaffFormModal";
import { ResetPinModal } from "@/components/employees/ResetPinModal";
import { AttendanceTable } from "@/components/employees/AttendanceTable";
import type { Staff } from "@/types";
import type { StaffCreateFormValues, StaffEditFormValues } from "@/schemas/employee";

const PAGE_SIZE = 20;
const ATT_PAGE_SIZE = 20;

type Tab = "staff" | "attendance";

// ── Delete / Deactivate confirm modals ───────────────────────────────────────

function DeleteModal({ staff, onConfirm, onClose, isPending }: { staff: Staff; onConfirm: () => void; onClose: () => void; isPending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,29,53,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 w-full" style={{ background: "white", maxWidth: 380, boxShadow: "0 16px 48px rgba(11,29,53,0.18)", animation: "fade-up 0.2s ease" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", marginBottom: 8 }}>Hapus Karyawan?</p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80", marginBottom: 20 }}>
          <strong>{staff.name}</strong> (@{staff.username}) akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
          <Button variant="danger" fullWidth loading={isPending} onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </div>
  );
}

function ToggleActiveModal({ staff, onConfirm, onClose, isPending }: { staff: Staff; onConfirm: () => void; onClose: () => void; isPending: boolean }) {
  const isDeactivating = staff.isActive;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,29,53,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 w-full" style={{ background: "white", maxWidth: 380, boxShadow: "0 16px 48px rgba(11,29,53,0.18)", animation: "fade-up 0.2s ease" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", marginBottom: 8 }}>
          {isDeactivating ? "Nonaktifkan Karyawan?" : "Aktifkan Karyawan?"}
        </p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80", marginBottom: 20 }}>
          {isDeactivating
            ? <><strong>{staff.name}</strong> tidak bisa login ke sistem setelah dinonaktifkan.</>
            : <><strong>{staff.name}</strong> akan bisa login kembali ke sistem.</>}
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
          <Button variant={isDeactivating ? "danger" : "primary"} fullWidth loading={isPending} onClick={onConfirm}>
            {isDeactivating ? "Nonaktifkan" : "Aktifkan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function EmployeesPage() {
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const [activeTab, setActiveTab] = useState<Tab>("staff");

  // ── Staff tab state ────────────────────────────────────────────────────────
  const { filters, updateFilter, toggleSort } = useStaffFilters();
  const debouncedSearch = useDebounce(filters.search, 350);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Staff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [resetPinTarget, setResetPinTarget] = useState<Staff | null>(null);
  const [toggleActiveTarget, setToggleActiveTarget] = useState<Staff | null>(null);

  const staffQueryParams = {
    page: filters.page,
    pageSize: PAGE_SIZE,
    ...(debouncedSearch && { search: debouncedSearch }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  const { data: staffData, isLoading: staffLoading } = useQuery({
    queryKey: queryKeys.staff.list(activeOutletId ?? ""),
    queryFn: () => employeeService.getList(activeOutletId!, staffQueryParams),
    enabled: !!activeOutletId,
  });

  const staffList = staffData?.data ?? [];
  const staffTotal = staffData?.meta?.total ?? 0;
  const staffTotalPages = staffData?.meta?.totalPages ?? 1;

  // ── Attendance tab state ───────────────────────────────────────────────────
  const [attPage, setAttPage] = useState(1);
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 7) + "-01";
  const [attDateFrom, setAttDateFrom] = useState(firstOfMonth);
  const [attDateTo, setAttDateTo] = useState(today);

  const { data: attData, isLoading: attLoading } = useQuery({
    queryKey: queryKeys.staff.attendance(activeOutletId ?? "", { dateFrom: attDateFrom, dateTo: attDateTo }),
    queryFn: () =>
      employeeService.getAttendance(activeOutletId!, {
        page: attPage,
        pageSize: ATT_PAGE_SIZE,
        dateFrom: attDateFrom,
        dateTo: attDateTo,
      }),
    enabled: !!activeOutletId && activeTab === "attendance",
  });

  const attRecords = attData?.data ?? [];
  const attTotalPages = attData?.meta?.totalPages ?? 1;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const invalidateStaff = () => queryClient.invalidateQueries({ queryKey: ["staff", activeOutletId] });

  const { mutate: createStaff, isPending: isCreating } = useMutation({
    mutationFn: (values: StaffCreateFormValues) => employeeService.create(activeOutletId!, values),
    onSuccess: () => { invalidateStaff(); setShowForm(false); },
  });

  const { mutate: updateStaff, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: StaffEditFormValues }) =>
      employeeService.update(activeOutletId!, id, values),
    onSuccess: () => { invalidateStaff(); setEditTarget(null); },
  });

  const { mutate: deleteStaff, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => employeeService.delete(activeOutletId!, id),
    onSuccess: () => { invalidateStaff(); setDeleteTarget(null); },
  });

  const { mutate: toggleActive, isPending: isTogglingActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      employeeService.setActive(activeOutletId!, id, isActive),
    onSuccess: () => { invalidateStaff(); setToggleActiveTarget(null); },
  });

  const { mutate: resetPin, isPending: isResettingPin } = useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) =>
      employeeService.resetPin(activeOutletId!, id, pin),
    onSuccess: () => { invalidateStaff(); setResetPinTarget(null); },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleFormSubmit(values: StaffCreateFormValues | StaffEditFormValues) {
    if (editTarget) {
      updateStaff({ id: editTarget.id, values: values as StaffEditFormValues });
    } else {
      createStaff(values as StaffCreateFormValues);
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,180,216,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCog size={18} color="#00B4D8" />
            </div>
            <h1 style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.375rem", color: "#0B1D35", margin: 0 }}>
              Karyawan
            </h1>
          </div>
          {!staffLoading && activeTab === "staff" && (
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", marginTop: 4, marginLeft: 50 }}>
              {staffTotal.toLocaleString("id-ID")} karyawan terdaftar
            </p>
          )}
        </div>
        {activeTab === "staff" && (
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => { setEditTarget(null); setShowForm(true); }}>
            Tambah Karyawan
          </Button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#F5F7FA", border: "1.5px solid #E8EDF2", alignSelf: "flex-start" }}>
        {(["staff", "attendance"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              height: 36,
              paddingInline: 18,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.8125rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
              background: activeTab === tab ? "white" : "transparent",
              color: activeTab === tab ? "#0B1D35" : "#8899AA",
              boxShadow: activeTab === tab ? "0 1px 4px rgba(11,29,53,0.08)" : "none",
            }}
          >
            {tab === "staff" ? <UserCog size={14} /> : <CalendarDays size={14} />}
            {tab === "staff" ? "Karyawan" : "Absensi"}
          </button>
        ))}
      </div>

      {/* ══ Tab: Staff ══ */}
      {activeTab === "staff" && (
        <>
          {/* Search + filter status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative" style={{ flex: "1 1 280px", maxWidth: 360 }}>
              <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Cari nama atau username..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                style={{ width: "100%", height: 44, paddingLeft: 40, paddingRight: 14, borderRadius: 12, border: "1.5px solid #E8EDF2", fontFamily: "Nunito Sans, system-ui", fontWeight: 500, fontSize: "0.8125rem", color: "#0B1D35", background: "white", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
              />
            </div>

            {/* Status filter */}
            {(["all", "active", "inactive"] as const).map((s) => {
              const label = s === "all" ? "Semua" : s === "active" ? "Aktif" : "Nonaktif";
              const filterVal = s === "all" ? undefined : s === "active" ? true : false;
              const isSelected = filters.isActive === filterVal;
              return (
                <button
                  key={s}
                  onClick={() => updateFilter("isActive", filterVal)}
                  style={{
                    height: 36,
                    paddingInline: 14,
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "#00B4D8" : "#E8EDF2"}`,
                    background: isSelected ? "rgba(0,180,216,0.08)" : "white",
                    color: isSelected ? "#0077B6" : "#5A6B80",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <StaffTable
            staff={staffList}
            isLoading={staffLoading}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSort={toggleSort}
            onEdit={(s) => setEditTarget(s)}
            onResetPin={(s) => setResetPinTarget(s)}
            onToggleActive={(s) => setToggleActiveTarget(s)}
            onDelete={(s) => setDeleteTarget(s)}
          />

          {!staffLoading && (
            <Pagination page={filters.page} totalPages={staffTotalPages} onPageChange={(p) => updateFilter("page", p)} />
          )}
        </>
      )}

      {/* ══ Tab: Attendance ══ */}
      {activeTab === "attendance" && (
        <>
          {/* Date range filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", whiteSpace: "nowrap" }}>
                Dari
              </label>
              <input
                type="date"
                value={attDateFrom}
                onChange={(e) => { setAttDateFrom(e.target.value); setAttPage(1); }}
                style={{ height: 40, padding: "0 12px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#0B1D35", background: "white", outline: "none", cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
              />
            </div>
            <div className="flex items-center gap-2">
              <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", whiteSpace: "nowrap" }}>
                Sampai
              </label>
              <input
                type="date"
                value={attDateTo}
                onChange={(e) => { setAttDateTo(e.target.value); setAttPage(1); }}
                style={{ height: 40, padding: "0 12px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#0B1D35", background: "white", outline: "none", cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
              />
            </div>
          </div>

          <AttendanceTable
            records={attRecords}
            isLoading={attLoading}
            page={attPage}
            totalPages={attTotalPages}
            onPageChange={setAttPage}
          />
        </>
      )}

      {/* ── Modals ── */}
      {showForm && (
        <StaffFormModal
          mode="create"
          onSubmit={(values) => handleFormSubmit(values)}
          onClose={() => setShowForm(false)}
          isPending={isCreating}
        />
      )}

      {editTarget && (
        <StaffFormModal
          mode="edit"
          defaultValues={{ name: editTarget.name, phone: editTarget.phone ?? "", username: editTarget.username, role: editTarget.role }}
          onSubmit={(values) => handleFormSubmit(values)}
          onClose={() => setEditTarget(null)}
          isPending={isUpdating}
        />
      )}

      {resetPinTarget && (
        <ResetPinModal
          staff={resetPinTarget}
          onConfirm={(pin) => resetPin({ id: resetPinTarget.id, pin })}
          onClose={() => setResetPinTarget(null)}
          isPending={isResettingPin}
        />
      )}

      {toggleActiveTarget && (
        <ToggleActiveModal
          staff={toggleActiveTarget}
          onConfirm={() => toggleActive({ id: toggleActiveTarget.id, isActive: !toggleActiveTarget.isActive })}
          onClose={() => setToggleActiveTarget(null)}
          isPending={isTogglingActive}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          staff={deleteTarget}
          onConfirm={() => deleteStaff(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}

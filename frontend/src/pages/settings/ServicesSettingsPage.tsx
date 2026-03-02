import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Package,
} from "lucide-react";

import { useAuthStore } from "@/store";
import { serviceService } from "@/services/service";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ServiceFormModal } from "@/components/settings/ServiceFormModal";
import type { Service } from "@/types";
import type { ServiceFormValues } from "@/schemas/settings";

// ── Format helpers ────────────────────────────────────────────────────────────

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);
}

function fmtDuration(hours: number) {
  if (hours < 24) return `${hours} jam`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return h > 0 ? `${d}h ${h}j` : `${d} hari`;
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: "1px solid #F0F3F6" }}
        >
          <Skeleton style={{ width: 28, height: 28, borderRadius: 8 }} />
          <Skeleton style={{ width: 160, height: 16, borderRadius: 6 }} />
          <Skeleton style={{ width: 80, height: 16, borderRadius: 6, marginLeft: "auto" }} />
          <Skeleton style={{ width: 50, height: 16, borderRadius: 6 }} />
          <Skeleton style={{ width: 60, height: 16, borderRadius: 6 }} />
          <Skeleton style={{ width: 56, height: 26, borderRadius: 8 }} />
          <Skeleton style={{ width: 68, height: 30, borderRadius: 8 }} />
        </div>
      ))}
    </>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({
  service,
  onConfirm,
  onClose,
  isPending,
}: {
  service: Service;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full mx-4"
        style={{
          background: "white",
          maxWidth: 380,
          boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
          animation: "fade-up 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1rem",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          Hapus Layanan?
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8125rem",
            color: "#5A6B80",
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Layanan <strong>{service.name}</strong> akan dihapus. Order yang sudah ada tidak terpengaruh karena harga sudah di-snapshot.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button variant="danger" fullWidth loading={isPending} onClick={onConfirm}>
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Service Row ───────────────────────────────────────────────────────────────

function ServiceRow({
  service,
  index,
  total,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: {
  service: Service;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-5 py-4"
      style={{
        borderBottom: "1px solid #F0F3F6",
        background: hover ? "#FAFBFC" : "white",
        transition: "background 0.12s",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Reorder buttons */}
      <div className="flex flex-col" style={{ gap: 1 }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          style={{
            width: 22,
            height: 18,
            border: "none",
            background: "transparent",
            cursor: index === 0 ? "not-allowed" : "pointer",
            color: index === 0 ? "#C4CDD6" : "#8899AA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            padding: 0,
          }}
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          style={{
            width: 22,
            height: 18,
            border: "none",
            background: "transparent",
            cursor: index === total - 1 ? "not-allowed" : "pointer",
            color: index === total - 1 ? "#C4CDD6" : "#8899AA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            padding: 0,
          }}
        >
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Service icon */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: service.isActive ? "rgba(0,180,216,0.09)" : "#F5F7FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Package size={16} color={service.isActive ? "#00B4D8" : "#C4CDD6"} />
      </div>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.8125rem",
            color: service.isActive ? "#0B1D35" : "#8899AA",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {service.name}
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.75rem",
            color: "#8899AA",
            margin: "1px 0 0",
          }}
        >
          Est. {fmtDuration(service.estimatedDuration)}
        </p>
      </div>

      {/* Price */}
      <p
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.8125rem",
          color: "#0B1D35",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {fmtCurrency(service.pricePerUnit)}
      </p>

      {/* Unit */}
      <span
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.72rem",
          color: "#5A6B80",
          background: "#F0F3F6",
          padding: "3px 8px",
          borderRadius: 6,
          whiteSpace: "nowrap",
        }}
      >
        /{service.unit}
      </span>

      {/* Status toggle */}
      <button
        type="button"
        onClick={onToggleActive}
        style={{
          height: 26,
          paddingInline: 10,
          borderRadius: 8,
          border: `1.5px solid ${service.isActive ? "#00B4D8" : "#E8EDF2"}`,
          background: service.isActive ? "rgba(0,180,216,0.08)" : "#F5F7FA",
          color: service.isActive ? "#0077B6" : "#8899AA",
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.72rem",
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {service.isActive ? "Aktif" : "Nonaktif"}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1.5px solid #E8EDF2",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5A6B80",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#00B4D8";
            e.currentTarget.style.color = "#0077B6";
            e.currentTarget.style.background = "rgba(0,180,216,0.07)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E8EDF2";
            e.currentTarget.style.color = "#5A6B80";
            e.currentTarget.style.background = "white";
          }}
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1.5px solid #E8EDF2",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5A6B80",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#EF2D56";
            e.currentTarget.style.color = "#EF2D56";
            e.currentTarget.style.background = "rgba(239,45,86,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E8EDF2";
            e.currentTarget.style.color = "#5A6B80";
            e.currentTarget.style.background = "white";
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ServicesSettingsPage() {
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.services.list(activeOutletId ?? ""),
    queryFn: () => serviceService.getByOutlet(activeOutletId!),
    enabled: !!activeOutletId,
  });

  const services: Service[] = data?.data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.services.list(activeOutletId!) });

  const { mutate: createService, isPending: isCreating } = useMutation({
    mutationFn: (values: ServiceFormValues) => serviceService.create(activeOutletId!, values),
    onSuccess: () => { invalidate(); setShowForm(false); },
  });

  const { mutate: updateService, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ServiceFormValues }) =>
      serviceService.update(activeOutletId!, id, values),
    onSuccess: () => { invalidate(); setEditTarget(null); },
  });

  const { mutate: deleteService, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => serviceService.delete(activeOutletId!, id),
    onSuccess: () => { invalidate(); setDeleteTarget(null); },
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      serviceService.update(activeOutletId!, id, { isActive }),
    onSuccess: invalidate,
  });

  const { mutate: reorder } = useMutation({
    mutationFn: (orderedIds: string[]) => serviceService.reorder(activeOutletId!, orderedIds),
    onSuccess: invalidate,
  });

  function moveService(index: number, direction: "up" | "down") {
    const newList = [...services];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newList[index], newList[swapIdx]] = [newList[swapIdx], newList[index]];
    reorder(newList.map((s) => s.id));
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(0,180,216,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={18} color="#00B4D8" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Layanan & Harga
            </h1>
            {!isLoading && (
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.78rem",
                  color: "#8899AA",
                  margin: "2px 0 0",
                }}
              >
                {services.length} layanan terdaftar ·{" "}
                {services.filter((s) => s.isActive).length} aktif
              </p>
            )}
          </div>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => { setEditTarget(null); setShowForm(true); }}
        >
          Tambah Layanan
        </Button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        {/* Table Header */}
        <div
          className="flex items-center gap-3 px-5 py-3"
          style={{ background: "#F5F7FA", borderBottom: "1.5px solid #E8EDF2" }}
        >
          <div style={{ width: 30 }} />
          <div style={{ width: 34 }} />
          <p
            style={{
              flex: 1,
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.72rem",
              color: "#5A6B80",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Nama Layanan
          </p>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.72rem",
              color: "#5A6B80",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Harga
          </p>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.72rem",
              color: "#5A6B80",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              width: 46,
              textAlign: "center",
            }}
          >
            Unit
          </p>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.72rem",
              color: "#5A6B80",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
              width: 64,
              textAlign: "center",
            }}
          >
            Status
          </p>
          <div style={{ width: 70 }} />
        </div>

        {/* Rows */}
        {isLoading ? (
          <TableSkeleton />
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(0,180,216,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={24} color="#00B4D8" opacity={0.6} />
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
              Belum ada layanan
            </p>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8125rem",
                color: "#8899AA",
                margin: 0,
                textAlign: "center",
              }}
            >
              Tambahkan layanan seperti cuci kiloan, express, dll.
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowForm(true)}
            >
              Tambah Layanan
            </Button>
          </div>
        ) : (
          services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              total={services.length}
              onEdit={() => setEditTarget(service)}
              onDelete={() => setDeleteTarget(service)}
              onToggleActive={() =>
                toggleActive({ id: service.id, isActive: !service.isActive })
              }
              onMoveUp={() => moveService(index, "up")}
              onMoveDown={() => moveService(index, "down")}
            />
          ))
        )}
      </div>

      {/* ── Modals ── */}
      {showForm && (
        <ServiceFormModal
          mode="create"
          onSubmit={createService}
          onClose={() => setShowForm(false)}
          isPending={isCreating}
        />
      )}

      {editTarget && (
        <ServiceFormModal
          mode="edit"
          defaultValues={{
            name: editTarget.name,
            pricePerUnit: editTarget.pricePerUnit,
            unit: editTarget.unit,
            estimatedDuration: editTarget.estimatedDuration,
            isActive: editTarget.isActive,
          }}
          onSubmit={(values) => updateService({ id: editTarget.id, values })}
          onClose={() => setEditTarget(null)}
          isPending={isUpdating}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          service={deleteTarget}
          onConfirm={() => deleteService(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}

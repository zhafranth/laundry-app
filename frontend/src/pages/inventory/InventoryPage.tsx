import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Search, AlertTriangle, ArrowUpRight } from "lucide-react";

import { useAuthStore } from "@/store";
import { inventoryService } from "@/services/inventory";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryFormModal } from "@/components/inventory/InventoryFormModal";
import { RestockModal } from "@/components/inventory/RestockModal";
import { UsageModal } from "@/components/inventory/UsageModal";
import { getInventoryStatus } from "@/components/inventory/InventoryStatusBadge";
import type { InventoryItem } from "@/types";
import type { InventoryItemFormValues, RestockFormValues, UsageFormValues } from "@/schemas/inventory";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ITEMS: InventoryItem[] = [
  {
    id: "inv-1", outletId: "o1", name: "Deterjen Cair", category: "Bahan Cuci",
    currentStock: 5, unit: "liter", minimumStock: 10,
    avgDailyUsage: 1.5, estimatedDaysLeft: 3, lastRestockedAt: "2026-02-20T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "inv-2", outletId: "o1", name: "Pewangi Sakura", category: "Pewangi & Softener",
    currentStock: 12, unit: "botol", minimumStock: 5,
    avgDailyUsage: 0.5, estimatedDaysLeft: 24, lastRestockedAt: "2026-02-25T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "inv-3", outletId: "o1", name: "Plastik Kemasan Besar", category: "Kemasan",
    currentStock: 150, unit: "pcs", minimumStock: 50,
    avgDailyUsage: 8, estimatedDaysLeft: 18, lastRestockedAt: "2026-02-28T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "inv-4", outletId: "o1", name: "Softener Fabcon", category: "Pewangi & Softener",
    currentStock: 3, unit: "liter", minimumStock: 4,
    avgDailyUsage: 0.3, estimatedDaysLeft: 10, lastRestockedAt: "2026-02-15T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "inv-5", outletId: "o1", name: "Hanger Baju", category: "Peralatan",
    currentStock: 80, unit: "pcs", minimumStock: 30,
    avgDailyUsage: null, estimatedDaysLeft: null, lastRestockedAt: "2026-01-10T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "inv-6", outletId: "o1", name: "Deterjen Bubuk Rinso", category: "Bahan Cuci",
    currentStock: 20, unit: "kg", minimumStock: 8,
    avgDailyUsage: 1.2, estimatedDaysLeft: 16, lastRestockedAt: "2026-02-22T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-02-22T00:00:00Z",
  },
  {
    id: "inv-7", outletId: "o1", name: "Kantong Plastik Kecil", category: "Kemasan",
    currentStock: 35, unit: "rol", minimumStock: 40,
    avgDailyUsage: 2, estimatedDaysLeft: 17, lastRestockedAt: "2026-02-18T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-02-18T00:00:00Z",
  },
  {
    id: "inv-8", outletId: "o1", name: "Pemutih Pakaian", category: "Bahan Cuci",
    currentStock: 6, unit: "liter", minimumStock: 6,
    avgDailyUsage: 0.4, estimatedDaysLeft: 15, lastRestockedAt: "2026-02-10T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-02-10T00:00:00Z",
  },
];

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "kritis", label: "Kritis" },
  { value: "perhatian", label: "Perhatian" },
  { value: "aman", label: "Aman" },
];

// ── Confirm Delete Modal ────────────────────────────────────────────────────────

function DeleteModal({
  item,
  onConfirm,
  onClose,
  isPending,
}: {
  item: InventoryItem;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(11,29,53,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 w-full" style={{ background: "white", maxWidth: 380, boxShadow: "0 16px 48px rgba(11,29,53,0.18)", animation: "fade-up 0.2s ease", margin: "0 16px" }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", marginBottom: 8 }}>Hapus Item Inventory?</p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80", marginBottom: 20 }}>
          <strong>{item.name}</strong> dan seluruh riwayat pergerakannya akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
          <Button variant="danger" fullWidth loading={isPending} onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export function InventoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const isOwner = user?.role === "owner";
  const isPro = user?.plan === "pro";

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [restockTarget, setRestockTarget] = useState<InventoryItem | null>(null);
  const [usageTarget, setUsageTarget] = useState<InventoryItem | null>(null);

  // ── Query (using mock) ────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.inventory.list(activeOutletId ?? ""),
    queryFn: () => inventoryService.getList(activeOutletId!),
    enabled: !!activeOutletId && isPro,
    placeholderData: { success: true, message: "", data: MOCK_ITEMS },
  });

  const items: InventoryItem[] = data?.data ?? MOCK_ITEMS;

  // ── Mutations ─────────────────────────────────────────────────────────────
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.inventory.list(activeOutletId ?? "") });

  const { mutate: createItem, isPending: isCreating } = useMutation({
    mutationFn: (values: InventoryItemFormValues) => inventoryService.create(activeOutletId!, values),
    onSuccess: () => { invalidate(); setShowForm(false); },
  });

  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: InventoryItemFormValues }) =>
      inventoryService.update(activeOutletId!, id, values),
    onSuccess: () => { invalidate(); setEditTarget(null); },
  });

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => inventoryService.delete(activeOutletId!, id),
    onSuccess: () => { invalidate(); setDeleteTarget(null); },
  });

  const { mutate: doRestock, isPending: isRestocking } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: RestockFormValues }) =>
      inventoryService.restock(activeOutletId!, id, values),
    onSuccess: () => { invalidate(); setRestockTarget(null); },
  });

  const { mutate: doUsage, isPending: isLoggingUsage } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: UsageFormValues }) =>
      inventoryService.logUsage(activeOutletId!, id, values),
    onSuccess: () => { invalidate(); setUsageTarget(null); },
  });

  // ── Derived data ─────────────────────────────────────────────────────────

  // Unique categories from items
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return cats.sort();
  }, [items]);

  // Filtered items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = !categoryFilter || item.category === categoryFilter;
      const matchStatus = !statusFilter || getInventoryStatus(item) === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  // Critical items for alert banner
  const criticalItems = useMemo(() => items.filter((i) => getInventoryStatus(i) === "kritis"), [items]);
  const cautionItems = useMemo(() => items.filter((i) => getInventoryStatus(i) === "perhatian"), [items]);

  // Restock prediction — items estimatedDaysLeft <= 7
  const restockSoon = useMemo(
    () => items.filter((i) => i.estimatedDaysLeft != null && i.estimatedDaysLeft <= 7).sort((a, b) => (a.estimatedDaysLeft ?? 0) - (b.estimatedDaysLeft ?? 0)),
    [items]
  );

  // ── Non-Pro guard ─────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl"
        style={{
          height: 440,
          background: "linear-gradient(135deg, rgba(255,183,3,0.04) 0%, rgba(0,180,216,0.04) 100%)",
          border: "1.5px dashed rgba(255,183,3,0.35)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{ width: 64, height: 64, background: "rgba(255,183,3,0.10)" }}
        >
          <ArrowUpRight size={28} color="#FFB703" />
        </div>
        <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.1rem", color: "#0B1D35", marginBottom: 6 }}>
          Fitur Pro — Smart Inventory
        </p>
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.875rem", color: "#5A6B80", textAlign: "center", maxWidth: 420, marginBottom: 16, lineHeight: 1.6 }}>
          Pantau stok bahan baku, lacak pemakaian harian, dan dapatkan prediksi restock otomatis. Upgrade ke Pro untuk mengaktifkan fitur ini.
        </p>
        <Badge variant="pro" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
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
              <Package size={18} color="#00B4D8" />
            </div>
            <h1 style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.375rem", color: "#0B1D35", margin: 0 }}>
              Inventory
            </h1>
            <Badge variant="pro" />
          </div>
          {!isLoading && (
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#8899AA", marginTop: 4, marginLeft: 50 }}>
              {items.length} item terdaftar
            </p>
          )}
        </div>
        {isOwner && (
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => { setEditTarget(null); setShowForm(true); }}>
            Tambah Item
          </Button>
        )}
      </div>

      {/* ── Alert: Kritis / Perhatian ── */}
      {!isLoading && criticalItems.length > 0 && (
        <div
          className="flex items-start gap-3 rounded-2xl px-5 py-4"
          style={{ background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.20)" }}
        >
          <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.85rem", color: "#DC2626", margin: "0 0 2px" }}>
              {criticalItems.length} item stok kritis!
            </p>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80", margin: 0 }}>
              {criticalItems.map((i) => i.name).join(", ")} — segera lakukan restock.
            </p>
          </div>
        </div>
      )}

      {!isLoading && criticalItems.length === 0 && cautionItems.length > 0 && (
        <div
          className="flex items-start gap-3 rounded-2xl px-5 py-4"
          style={{ background: "rgba(255,183,3,0.06)", border: "1.5px solid rgba(255,183,3,0.25)" }}
        >
          <AlertTriangle size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.85rem", color: "#B45309", margin: "0 0 2px" }}>
              {cautionItems.length} item perlu perhatian
            </p>
            <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80", margin: 0 }}>
              {cautionItems.map((i) => i.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Prediksi Restock ── */}
      {!isLoading && restockSoon.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: "1.5px solid #E8EDF2", boxShadow: "0 2px 8px rgba(11,29,53,0.06)" }}
        >
          <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "0.875rem", color: "#0B1D35", marginBottom: 12 }}>
            Prediksi Restock (≤ 7 hari)
          </p>
          <div className="flex flex-wrap gap-2">
            {restockSoon.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 10,
                  background: (item.estimatedDaysLeft ?? 0) <= 3 ? "rgba(239,68,68,0.06)" : "rgba(255,183,3,0.06)",
                  border: `1.5px solid ${(item.estimatedDaysLeft ?? 0) <= 3 ? "rgba(239,68,68,0.20)" : "rgba(255,183,3,0.20)"}`,
                }}
              >
                <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.8rem", color: "#0B1D35" }}>
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.75rem",
                    color: (item.estimatedDaysLeft ?? 0) <= 3 ? "#DC2626" : "#B45309",
                    fontWeight: 600,
                  }}
                >
                  habis ~{item.estimatedDaysLeft} hari
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter + Search ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative" style={{ flex: "1 1 280px", maxWidth: 360 }}>
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8899AA", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Cari nama item atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", height: 44, paddingLeft: 40, paddingRight: 14,
              borderRadius: 12, border: "1.5px solid #E8EDF2",
              fontFamily: "Nunito Sans, system-ui", fontWeight: 500, fontSize: "0.8125rem",
              color: "#0B1D35", background: "white", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            height: 44, padding: "0 14px", borderRadius: 12, border: "1.5px solid #E8EDF2",
            fontFamily: "Nunito Sans, system-ui", fontWeight: 500, fontSize: "0.8125rem",
            color: categoryFilter ? "#0B1D35" : "#8899AA", background: "white", outline: "none", cursor: "pointer",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status filter pills */}
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              style={{
                height: 36, paddingInline: 14, borderRadius: 10,
                border: `1.5px solid ${isSelected ? "#00B4D8" : "#E8EDF2"}`,
                background: isSelected ? "rgba(0,180,216,0.08)" : "white",
                color: isSelected ? "#0077B6" : "#5A6B80",
                fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <InventoryTable
        items={filtered}
        isLoading={isLoading}
        isOwner={isOwner}
        onRestock={(item) => setRestockTarget(item)}
        onUsage={(item) => setUsageTarget(item)}
        onEdit={(item) => setEditTarget(item)}
        onDelete={(item) => setDeleteTarget(item)}
        onHistory={(item) => navigate(`/inventory/${item.id}/history`)}
      />

      {/* ── Modals ── */}
      {showForm && (
        <InventoryFormModal
          mode="create"
          onSubmit={createItem}
          onClose={() => setShowForm(false)}
          isPending={isCreating}
        />
      )}

      {editTarget && (
        <InventoryFormModal
          mode="edit"
          defaultValues={editTarget}
          onSubmit={(values) => updateItem({ id: editTarget.id, values })}
          onClose={() => setEditTarget(null)}
          isPending={isUpdating}
        />
      )}

      {restockTarget && (
        <RestockModal
          item={restockTarget}
          onSubmit={(values) => doRestock({ id: restockTarget.id, values })}
          onClose={() => setRestockTarget(null)}
          isPending={isRestocking}
        />
      )}

      {usageTarget && (
        <UsageModal
          item={usageTarget}
          onSubmit={(values) => doUsage({ id: usageTarget.id, values })}
          onClose={() => setUsageTarget(null)}
          isPending={isLoggingUsage}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={() => deleteItem(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}

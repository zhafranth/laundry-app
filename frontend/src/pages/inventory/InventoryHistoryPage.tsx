import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, History } from "lucide-react";

import { useAuthStore } from "@/store";
import { inventoryService } from "@/services/inventory";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/Button";
import { InventoryStatusBadge, getInventoryStatus } from "@/components/inventory/InventoryStatusBadge";
import { InventoryHistoryTable } from "@/components/inventory/InventoryHistoryTable";
import type { InventoryItem, InventoryLog } from "@/types";

const PAGE_SIZE = 20;

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ITEM: InventoryItem = {
  id: "inv-1", outletId: "o1", name: "Deterjen Cair", category: "Bahan Cuci",
  currentStock: 5, unit: "liter", minimumStock: 10,
  avgDailyUsage: 1.5, estimatedDaysLeft: 3, lastRestockedAt: "2026-02-20T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z",
};

const MOCK_LOGS: InventoryLog[] = [
  { id: "log-1", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "masuk", qty: 20, unitCost: 15000, supplier: "Toko Surya", notes: "Restock bulanan", logDate: "2026-02-20", createdByName: "Budi (Owner)", createdAt: "2026-02-20T08:00:00Z" },
  { id: "log-2", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 3, unitCost: null, supplier: null, notes: null, logDate: "2026-02-22", createdByName: "Siti (Kasir)", createdAt: "2026-02-22T10:00:00Z" },
  { id: "log-3", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 2.5, unitCost: null, supplier: null, notes: "Order express pakai lebih banyak", logDate: "2026-02-24", createdByName: "Siti (Kasir)", createdAt: "2026-02-24T11:30:00Z" },
  { id: "log-4", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 1.5, unitCost: null, supplier: null, notes: null, logDate: "2026-02-26", createdByName: "Budi (Owner)", createdAt: "2026-02-26T09:00:00Z" },
  { id: "log-5", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 3, unitCost: null, supplier: null, notes: null, logDate: "2026-02-28", createdByName: "Andi (Operator)", createdAt: "2026-02-28T14:00:00Z" },
  { id: "log-6", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 2, unitCost: null, supplier: null, notes: null, logDate: "2026-03-01", createdByName: "Siti (Kasir)", createdAt: "2026-03-01T09:00:00Z" },
  { id: "log-7", inventoryItemId: "inv-1", itemName: "Deterjen Cair", type: "keluar", qty: 3, unitCost: null, supplier: null, notes: null, logDate: "2026-03-02", createdByName: "Andi (Operator)", createdAt: "2026-03-02T10:00:00Z" },
];

// ── Type Badge ─────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "masuk", label: "Masuk" },
  { value: "keluar", label: "Keluar" },
] as const;

// ── Main Page ──────────────────────────────────────────────────────────────────

export function InventoryHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"" | "masuk" | "keluar">("");
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 7) + "-01";
  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);

  // ── Fetch item detail ──────────────────────────────────────────────────────
  const { data: itemData } = useQuery({
    queryKey: queryKeys.inventory.detail(activeOutletId ?? "", id ?? ""),
    queryFn: () => inventoryService.getDetail(activeOutletId!, id!),
    enabled: !!activeOutletId && !!id,
    placeholderData: { success: true, message: "", data: MOCK_ITEM },
  });

  const item = itemData?.data ?? MOCK_ITEM;

  // ── Fetch logs ─────────────────────────────────────────────────────────────
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: queryKeys.inventory.logs(activeOutletId ?? "", id ?? ""),
    queryFn: () =>
      inventoryService.getLogs(activeOutletId!, id!, {
        page,
        pageSize: PAGE_SIZE,
        ...(typeFilter && { type: typeFilter }),
        dateFrom,
        dateTo,
      }),
    enabled: !!activeOutletId && !!id,
    placeholderData: {
      success: true,
      message: "",
      data: MOCK_LOGS,
      meta: { page: 1, pageSize: PAGE_SIZE, total: MOCK_LOGS.length, totalPages: 1 },
    },
  });

  const logs: InventoryLog[] = logsData?.data ?? MOCK_LOGS;
  const totalPages = logsData?.meta?.totalPages ?? 1;

  const status = getInventoryStatus(item);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Back + Header ── */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate(-1)}
          style={{ marginTop: 4 }}
        >
          Kembali
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "rgba(0,180,216,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <History size={20} color="#00B4D8" />
          </div>
          <div>
            <h1 style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1.25rem", color: "#0B1D35", margin: 0 }}>
              Riwayat — {item.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.78rem", color: "#8899AA" }}>
                {item.category} · Stok:{" "}
                <strong style={{ color: "#0B1D35" }}>
                  {item.currentStock.toLocaleString("id-ID")} {item.unit}
                </strong>
              </span>
              <InventoryStatusBadge status={status} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type filter pills */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#F5F7FA", border: "1.5px solid #E8EDF2", alignSelf: "flex-start" }}>
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setTypeFilter(opt.value as typeof typeFilter); setPage(1); }}
              style={{
                height: 34,
                paddingInline: 16,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.78rem",
                transition: "all 0.15s",
                background: typeFilter === opt.value ? "white" : "transparent",
                color: typeFilter === opt.value ? "#0B1D35" : "#8899AA",
                boxShadow: typeFilter === opt.value ? "0 1px 4px rgba(11,29,53,0.08)" : "none",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80", whiteSpace: "nowrap" }}>
            Dari
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
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
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            style={{ height: 40, padding: "0 12px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#0B1D35", background: "white", outline: "none", cursor: "pointer" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
          />
        </div>
      </div>

      {/* ── History Table ── */}
      <InventoryHistoryTable
        logs={logs}
        isLoading={logsLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

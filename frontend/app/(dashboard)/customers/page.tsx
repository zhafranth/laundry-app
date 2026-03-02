"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Users } from "lucide-react";

import { useAuthStore } from "@/store";
import { customerService } from "@/services/customer";
import { queryKeys } from "@/lib/query-keys";
import { useCustomerFilters } from "@/hooks/useCustomerFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import type { Customer } from "@/types";
import type { CustomerFormValues } from "@/schemas/customer";

const PAGE_SIZE = 20;

function DeleteModal({
  customer,
  onConfirm,
  onClose,
  isPending,
}: {
  customer: Customer;
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
        className="rounded-2xl p-6 w-full"
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
          Hapus Pelanggan?
        </p>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8125rem",
            color: "#5A6B80",
            marginBottom: 20,
          }}
        >
          <strong>{customer.name}</strong> ({customer.phone}) akan dihapus
          permanen. Riwayat order tetap tersimpan. Tindakan ini tidak bisa
          dibatalkan.
        </p>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={isPending}
            onClick={onConfirm}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === "owner";

  const { filters, updateFilter, toggleSort } = useCustomerFilters();
  const debouncedSearch = useDebounce(filters.search, 350);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const queryParams = {
    page: filters.page,
    pageSize: PAGE_SIZE,
    ...(debouncedSearch && { search: debouncedSearch }),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.customers.list(activeOutletId ?? "", queryParams),
    queryFn: () => customerService.getList(activeOutletId!, queryParams),
    enabled: !!activeOutletId,
  });

  const customers = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const total = data?.meta?.total ?? 0;

  const { mutate: createCustomer, isPending: isCreating } = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      customerService.create(activeOutletId!, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", activeOutletId],
      });
      setShowForm(false);
    },
  });

  const { mutate: updateCustomer, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      customerService.update(activeOutletId!, id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", activeOutletId],
      });
      setEditTarget(null);
    },
  });

  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) =>
      customerService.delete(activeOutletId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", activeOutletId],
      });
      setDeleteTarget(null);
    },
  });

  function handleEdit(customer: Customer) {
    setEditTarget(customer);
  }

  function handleFormSubmit(values: CustomerFormValues) {
    if (editTarget) {
      updateCustomer({ id: editTarget.id, values });
    } else {
      createCustomer(values);
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Header ── */}
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
              <Users size={18} color="#00B4D8" />
            </div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.375rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Pelanggan
            </h1>
          </div>
          {!isLoading && (
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
                marginTop: 4,
                marginLeft: 50,
              }}
            >
              {total.toLocaleString("id-ID")} pelanggan ditemukan
            </p>
          )}
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
        >
          Tambah Pelanggan
        </Button>
      </div>

      {/* ── Search ── */}
      <div className="relative" style={{ maxWidth: 360 }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#8899AA",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Cari nama atau nomor HP..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          style={{
            width: "100%",
            height: 44,
            paddingLeft: 40,
            paddingRight: 14,
            borderRadius: 12,
            border: "1.5px solid #E8EDF2",
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 500,
            fontSize: "0.8125rem",
            color: "#0B1D35",
            background: "white",
            outline: "none",
            transition: "border-color 0.15s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00B4D8")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E8EDF2")}
        />
      </div>

      {/* ── Table ── */}
      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={toggleSort}
        onEdit={handleEdit}
        onDelete={(c) => setDeleteTarget(c)}
        isOwner={isOwner}
      />

      {/* ── Pagination ── */}
      {!isLoading && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          onPageChange={(p) => updateFilter("page", p)}
        />
      )}

      {/* ── Form Modal (create / edit) ── */}
      {(showForm || editTarget) && (
        <CustomerFormModal
          mode={editTarget ? "edit" : "create"}
          defaultValues={
            editTarget
              ? {
                  name: editTarget.name,
                  phone: editTarget.phone,
                  address: editTarget.address ?? "",
                  notes: editTarget.notes ?? "",
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          isPending={isCreating || isUpdating}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          customer={deleteTarget}
          onConfirm={() => deleteCustomer(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}

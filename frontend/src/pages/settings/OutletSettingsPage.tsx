import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Camera, Save, AlertCircle } from "lucide-react";

import { useAuthStore } from "@/store";
import { outletService } from "@/services/outlet";
import { queryKeys } from "@/lib/query-keys";
import { outletProfileSchema, type OutletProfileFormValues } from "@/schemas/settings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

// ── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3">
        <Skeleton style={{ width: 38, height: 38, borderRadius: 10 }} />
        <Skeleton style={{ width: 180, height: 26, borderRadius: 8 }} />
      </div>
      <div className="rounded-2xl p-5" style={{ border: "1.5px solid #E8EDF2", background: "white" }}>
        <Skeleton style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 24 }} />
        <div className="flex flex-col gap-4">
          <Skeleton style={{ width: "100%", height: 48, borderRadius: 12 }} />
          <Skeleton style={{ width: "100%", height: 48, borderRadius: 12 }} />
          <Skeleton style={{ width: "100%", height: 48, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        padding: "12px 20px",
        borderRadius: 12,
        background: type === "success" ? "#00C853" : "#EF2D56",
        color: "white",
        fontFamily: "Manrope, system-ui",
        fontWeight: 700,
        fontSize: "0.8125rem",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        animation: "fade-up 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "error" && <AlertCircle size={14} />}
      {message}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function OutletSettingsPage() {
  const queryClient = useQueryClient();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.outlets.detail(activeOutletId ?? ""),
    queryFn: () => outletService.getOutlet(activeOutletId!),
    enabled: !!activeOutletId,
  });

  const outlet = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OutletProfileFormValues>({
    resolver: zodResolver(outletProfileSchema),
    values: outlet
      ? {
          name: outlet.name,
          address: outlet.address ?? "",
          phone: outlet.phone ?? "",
        }
      : undefined,
  });

  const { mutate: updateOutlet, isPending: isSaving } = useMutation({
    mutationFn: (values: OutletProfileFormValues) =>
      outletService.updateOutlet(activeOutletId!, {
        name: values.name,
        address: values.address || undefined,
        phone: values.phone || undefined,
      }),
    onSuccess: async () => {
      if (logoFile) {
        await outletService.uploadLogo(activeOutletId!, logoFile);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.outlets.detail(activeOutletId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.outlets.list });
      setLogoFile(null);
      reset(undefined, { keepValues: true });
      showToast("Profil outlet berhasil disimpan", "success");
    },
    onError: () => showToast("Gagal menyimpan, coba lagi", "error"),
  });

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File harus berupa gambar (JPG, PNG, WebP)", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 2MB", "error");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  if (isLoading) return <PageSkeleton />;

  const currentLogo = logoPreview ?? outlet?.logoUrl ?? null;
  const hasChanges = isDirty || !!logoFile;

  return (
    <div className="flex flex-col gap-5 pb-8">
      {toast && <Toast message={toast.message} type={toast.type} />}

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
            <Building2 size={18} color="#00B4D8" />
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
              Profil Outlet
            </h1>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.78rem",
                color: "#8899AA",
                margin: "2px 0 0",
              }}
            >
              Info dan identitas outlet yang tampil di nota
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit((v) => updateOutlet(v))} noValidate>
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          {/* ── Logo Card ── */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ border: "1.5px solid #E8EDF2", background: "white" }}
          >
            <p
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Logo Outlet
            </p>

            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: "50%",
                  border: "3px solid #E8EDF2",
                  background: currentLogo ? "transparent" : "rgba(0,180,216,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Logo outlet"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Building2 size={40} color="#00B4D8" opacity={0.6} />
                )}
              </div>

              {/* Upload button */}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  height: 38,
                  paddingInline: 18,
                  borderRadius: 10,
                  border: "1.5px solid #00B4D8",
                  background: "rgba(0,180,216,0.07)",
                  color: "#0077B6",
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,180,216,0.14)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,180,216,0.07)";
                }}
              >
                <Camera size={14} />
                {currentLogo ? "Ganti Logo" : "Upload Logo"}
              </button>

              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.72rem",
                  color: "#8899AA",
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Format: JPG, PNG, WebP
                <br />
                Ukuran maks: 2MB · Rekomendasi: 200×200px
              </p>
            </div>
          </div>

          {/* ── Info Card ── */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ border: "1.5px solid #E8EDF2", background: "white" }}
          >
            <p
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Informasi Outlet
            </p>

            <Input
              label="Nama Outlet"
              placeholder="Cth: LaundryKu Cabang Utama"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Alamat"
              placeholder="Cth: Jl. Merdeka No. 12, Jakarta"
              error={errors.address?.message}
              {...register("address")}
            />

            <Input
              label="No. Telepon"
              placeholder="Cth: 08123456789"
              type="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <div className="flex gap-3 mt-2">
              {hasChanges && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    reset();
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}
                  disabled={isSaving}
                >
                  Reset
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                loading={isSaving}
                leftIcon={<Save size={15} />}
                fullWidth={!hasChanges}
                disabled={!hasChanges && !logoFile}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

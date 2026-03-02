import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Save } from "lucide-react";

import { createOrderSchema, type CreateOrderInput } from "@/schemas/order";
import { orderService } from "@/services/order";
import { serviceService } from "@/services/service";
import { queryKeys } from "@/lib/query-keys";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CustomerAutocomplete } from "@/components/orders/CustomerAutocomplete";
import {
  ServiceItemsField,
  type ServiceItemsFieldErrors,
} from "@/components/orders/ServiceItemsField";

const labelStyle: React.CSSProperties = {
  fontFamily: "Manrope, system-ui",
  fontWeight: 700,
  fontSize: "0.75rem",
  color: "#3D5068",
  letterSpacing: "0.01em",
};

const errorStyle: React.CSSProperties = {
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 600,
  fontSize: "0.75rem",
  color: "#EF2D56",
};

const selectStyle: React.CSSProperties = {
  height: 48,
  padding: "0 14px",
  borderRadius: 12,
  border: "2px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  outline: "none",
  width: "100%",
  appearance: "none",
  WebkitAppearance: "none",
};

const sectionStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #E8EDF2",
  borderRadius: 16,
  padding: "20px",
  boxShadow: "0 2px 8px rgba(11,29,53,0.06)",
};

interface CreateOrderFormProps {
  outletId: string;
  onSuccess?: (orderId: string) => void;
}

export function CreateOrderForm({ outletId, onSuccess }: CreateOrderFormProps) {
  const navigate = useNavigate();
  const [submitType, setSubmitType] = useState<"save" | "save_print">("save");

  const methods = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerId: undefined,
      customerName: "",
      customerPhone: "",
      items: [{ serviceId: "", qty: 1, pricePerUnit: 0 }],
      notes: "",
      estimatedFinishedAt: "",
      paymentStatus: "belum_bayar",
      paymentMethod: undefined,
      paidAmount: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;

  const { data: servicesData } = useQuery({
    queryKey: queryKeys.services.list(outletId),
    queryFn: () => serviceService.getByOutlet(outletId),
    enabled: !!outletId,
  });

  const services = (servicesData?.data ?? []).filter((s) => s.isActive);

  const paymentStatus = watch("paymentStatus");
  const items = useWatch({ control, name: "items" });

  const totalAmount = items.reduce((sum, it) => {
    const qty = Number(it?.qty ?? 0);
    const price = Number(it?.pricePerUnit ?? 0);
    return sum + qty * price;
  }, 0);

  const paidAmount = watch("paidAmount") ?? 0;
  const remaining =
    paymentStatus === "lunas"
      ? 0
      : paymentStatus === "dp"
      ? Math.max(0, totalAmount - Number(paidAmount))
      : totalAmount;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateOrderInput) => orderService.create(outletId, data),
    onSuccess: (res) => {
      const orderId = res.data.id;
      if (submitType === "save_print") {
        window.open(`/orders/${orderId}/print`, "_blank");
      }
      if (onSuccess) {
        onSuccess(orderId);
      } else {
        navigate(`/orders/${orderId}`);
      }
    },
  });

  function onSubmit(data: CreateOrderInput) {
    if (paymentStatus === "lunas") {
      data.paidAmount = totalAmount;
    }
    mutate(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* ── Pelanggan ── */}
        <div style={sectionStyle}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.9375rem",
              color: "#0B1D35",
              marginBottom: 16,
            }}
          >
            Informasi Pelanggan
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <CustomerAutocomplete
              outletId={outletId}
              selectedCustomerId={watch("customerId")}
              selectedName={watch("customerName")}
              onSelect={({ id, name, phone }) => {
                setValue("customerId", id);
                setValue("customerName", name);
                setValue("customerPhone", phone);
              }}
              error={errors.customerName?.message}
            />

            <Input
              label="Nomor HP"
              placeholder="08xxxxxxxxxx"
              type="tel"
              {...register("customerPhone")}
              error={errors.customerPhone?.message}
            />
          </div>
        </div>

        {/* ── Layanan ── */}
        <div style={sectionStyle}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.9375rem",
              color: "#0B1D35",
              marginBottom: 16,
            }}
          >
            Layanan
          </p>

          {services.length === 0 ? (
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                height: 80,
                background: "#F8FAFC",
                border: "1.5px dashed #C4CDD6",
              }}
            >
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.8rem",
                  color: "#8899AA",
                }}
              >
                Belum ada layanan aktif.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/settings/services")}
                  style={{
                    color: "#00B4D8",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Tambah layanan →
                </button>
              </p>
            </div>
          ) : (
            <ServiceItemsField
              services={services}
              errors={errors as ServiceItemsFieldErrors}
            />
          )}
        </div>

        {/* ── Catatan & Estimasi ── */}
        <div style={sectionStyle}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.9375rem",
              color: "#0B1D35",
              marginBottom: 16,
            }}
          >
            Catatan & Estimasi
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Catatan (opsional)</label>
              <textarea
                {...register("notes")}
                placeholder="Contoh: ada noda di kerah, jangan dicampur..."
                rows={3}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "2px solid #E8EDF2",
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  color: "#0B1D35",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Estimasi Selesai (opsional)</label>
              <input
                type="datetime-local"
                {...register("estimatedFinishedAt")}
                style={{
                  height: 48,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "2px solid #E8EDF2",
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  color: "#0B1D35",
                  outline: "none",
                  background: "white",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Pembayaran ── */}
        <div style={sectionStyle}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.9375rem",
              color: "#0B1D35",
              marginBottom: 16,
            }}
          >
            Pembayaran
          </p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {/* Payment status */}
            <div className="flex flex-col gap-1.5">
              <label style={labelStyle}>Status Pembayaran</label>
              <select
                {...register("paymentStatus")}
                style={{
                  ...selectStyle,
                  borderColor: errors.paymentStatus ? "#EF2D56" : "#E8EDF2",
                }}
              >
                <option value="belum_bayar">Belum Bayar</option>
                <option value="dp">DP (Uang Muka)</option>
                <option value="lunas">Lunas</option>
              </select>
              {errors.paymentStatus && (
                <p style={errorStyle}>{errors.paymentStatus.message}</p>
              )}
            </div>

            {/* Payment method */}
            {paymentStatus !== "belum_bayar" && (
              <div className="flex flex-col gap-1.5">
                <label style={labelStyle}>Metode Pembayaran</label>
                <select
                  {...register("paymentMethod")}
                  style={{
                    ...selectStyle,
                    borderColor: errors.paymentMethod ? "#EF2D56" : "#E8EDF2",
                  }}
                >
                  <option value="">-- Pilih --</option>
                  <option value="tunai">Tunai</option>
                  <option value="transfer">Transfer</option>
                  <option value="qris">QRIS</option>
                </select>
                {errors.paymentMethod && (
                  <p style={errorStyle}>{errors.paymentMethod.message}</p>
                )}
              </div>
            )}

            {/* DP amount */}
            {paymentStatus === "dp" && (
              <Input
                label="Jumlah DP (Rp)"
                type="number"
                min="0"
                placeholder="0"
                {...register("paidAmount", { valueAsNumber: true })}
                error={errors.paidAmount?.message}
              />
            )}
          </div>
        </div>

        {/* ── Summary ── */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #0B1D35 0%, #1A3255 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 12,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Ringkasan Pembayaran
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Total Harga
              </span>
              <span
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "white",
                }}
              >
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>

            {paymentStatus === "dp" && (
              <div className="flex justify-between">
                <span
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  Dibayar (DP)
                </span>
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#FFB703",
                  }}
                >
                  Rp {Number(paidAmount).toLocaleString("id-ID")}
                </span>
              </div>
            )}

            {paymentStatus === "lunas" && (
              <div className="flex justify-between">
                <span
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  Status
                </span>
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#00C853",
                  }}
                >
                  ✓ LUNAS
                </span>
              </div>
            )}

            {paymentStatus !== "lunas" && (
              <>
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.1)",
                    margin: "4px 0",
                  }}
                />
                <div className="flex justify-between">
                  <span
                    style={{
                      fontFamily: "Nunito Sans, system-ui",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    Sisa Bayar
                  </span>
                  <span
                    style={{
                      fontFamily: "Manrope, system-ui",
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      color: remaining > 0 ? "#FFB703" : "#00C853",
                    }}
                  >
                    Rp {remaining.toLocaleString("id-ID")}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex justify-end gap-3 pb-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={isPending}
          >
            Batal
          </Button>

          <Button
            type="submit"
            variant="outline"
            leftIcon={<FileText size={15} />}
            loading={isPending && submitType === "save_print"}
            disabled={isPending}
            onClick={() => setSubmitType("save_print")}
          >
            Simpan & Cetak Nota
          </Button>

          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save size={15} />}
            loading={isPending && submitType === "save"}
            disabled={isPending}
            onClick={() => setSubmitType("save")}
          >
            Simpan Order
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

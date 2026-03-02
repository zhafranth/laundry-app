import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PinInput } from "@/components/ui/PinInput";
import { resetPinSchema, type ResetPinFormValues } from "@/schemas/employee";
import type { Staff } from "@/types";

interface ResetPinModalProps {
  staff: Staff;
  onConfirm: (pin: string) => void;
  onClose: () => void;
  isPending: boolean;
}

export function ResetPinModal({ staff, onConfirm, onClose, isPending }: ResetPinModalProps) {
  const { handleSubmit, control, formState: { errors } } = useForm<ResetPinFormValues>({
    resolver: zodResolver(resetPinSchema),
    defaultValues: { pin: "", confirmPin: "" },
  });

  function onSubmit(values: ResetPinFormValues) {
    onConfirm(values.pin);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full"
        style={{
          background: "white",
          maxWidth: 420,
          boxShadow: "0 16px 48px rgba(11,29,53,0.18)",
          animation: "fade-up 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1.5px solid #F0F3F7" }}
        >
          <div className="flex items-center gap-2.5">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,183,3,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <KeyRound size={15} color="#B88000" />
            </div>
            <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", margin: 0 }}>
              Reset PIN
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E8EDF2", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={15} color="#5A6B80" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-5">
          <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8125rem", color: "#5A6B80", margin: 0 }}>
            Buat PIN baru untuk <strong style={{ color: "#0B1D35" }}>{staff.name}</strong> (@{staff.username}).
          </p>

          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068", letterSpacing: "0.01em" }}>
              PIN Baru
            </label>
            <Controller
              name="pin"
              control={control}
              render={({ field, fieldState }) => (
                <PinInput value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068", letterSpacing: "0.01em" }}>
              Konfirmasi PIN
            </label>
            <Controller
              name="confirmPin"
              control={control}
              render={({ field, fieldState }) => (
                <PinInput value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
              )}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={isPending}>
              Simpan PIN Baru
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

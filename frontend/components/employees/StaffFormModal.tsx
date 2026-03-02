import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PinInput } from "@/components/ui/PinInput";
import {
  staffCreateSchema,
  staffEditSchema,
  type StaffCreateFormValues,
  type StaffEditFormValues,
} from "@/schemas/employee";
import type { Staff } from "@/types";

const ROLE_OPTIONS = [
  { value: "kasir", label: "Kasir" },
  { value: "operator", label: "Operator" },
];

// ── Shared UI pieces ──────────────────────────────────────────────────────────

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,29,53,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full"
        style={{ background: "white", maxWidth: 480, boxShadow: "0 16px 48px rgba(11,29,53,0.18)", animation: "fade-up 0.2s ease", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1.5px solid #F0F3F7" }}>
      <p style={{ fontFamily: "Manrope, system-ui", fontWeight: 800, fontSize: "1rem", color: "#0B1D35", margin: 0 }}>
        {title}
      </p>
      <button
        type="button"
        onClick={onClose}
        style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E8EDF2", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <X size={15} color="#5A6B80" />
      </button>
    </div>
  );
}

function RoleSelect({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068", letterSpacing: "0.01em" }}>
        Role
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 48,
          padding: "0 14px",
          borderRadius: 12,
          border: `2px solid ${focused ? "#00B4D8" : "#E8EDF2"}`,
          fontFamily: "Nunito Sans, system-ui",
          fontWeight: 500,
          fontSize: "0.8125rem",
          color: "#0B1D35",
          background: "white",
          outline: "none",
          width: "100%",
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.75rem", color: "#EF2D56", margin: 0 }}>{error}</p>
      )}
    </div>
  );
}

// ── Create Form ───────────────────────────────────────────────────────────────

function CreateForm({ onSubmit, onClose, isPending }: {
  onSubmit: (values: StaffCreateFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<StaffCreateFormValues>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: { name: "", phone: "", username: "", pin: "", role: "kasir" },
  });

  const roleValue = watch("role");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 py-5">
      <Input label="Nama Lengkap" placeholder="Contoh: Budi Santoso" error={errors.name?.message} {...register("name")} />
      <Input label="Nomor HP (opsional)" placeholder="Contoh: 08123456789" inputMode="numeric" error={errors.phone?.message} {...register("phone")} />
      <Input label="Username" placeholder="Contoh: budi_kasir (tanpa spasi)" error={errors.username?.message} {...register("username")} />

      <RoleSelect
        value={roleValue}
        onChange={(v) => setValue("role", v as "kasir" | "operator")}
        error={errors.role?.message}
      />

      <div className="flex flex-col gap-2">
        <label style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068", letterSpacing: "0.01em" }}>
          PIN (6 digit)
        </label>
        <Controller
          name="pin"
          control={control}
          render={({ field, fieldState }) => (
            <PinInput value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.775rem", color: "#8899AA", margin: 0 }}>
          Staff akan menggunakan PIN ini untuk login.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
        <Button type="submit" variant="primary" fullWidth loading={isPending}>Simpan Karyawan</Button>
      </div>
    </form>
  );
}

// ── Edit Form ─────────────────────────────────────────────────────────────────

function EditForm({ defaultValues, onSubmit, onClose, isPending }: {
  defaultValues: Partial<StaffEditFormValues>;
  onSubmit: (values: StaffEditFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<StaffEditFormValues>({
    resolver: zodResolver(staffEditSchema),
    defaultValues: { name: "", phone: "", username: "", role: "kasir", ...defaultValues },
  });

  const roleValue = watch("role");

  useEffect(() => {
    reset({ name: "", phone: "", username: "", role: "kasir", ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 py-5">
      <Input label="Nama Lengkap" placeholder="Contoh: Budi Santoso" error={errors.name?.message} {...register("name")} />
      <Input label="Nomor HP (opsional)" placeholder="Contoh: 08123456789" inputMode="numeric" error={errors.phone?.message} {...register("phone")} />
      <Input label="Username" placeholder="Contoh: budi_kasir (tanpa spasi)" error={errors.username?.message} {...register("username")} />

      <RoleSelect
        value={roleValue}
        onChange={(v) => setValue("role", v as "kasir" | "operator")}
        error={errors.role?.message}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isPending}>Batal</Button>
        <Button type="submit" variant="primary" fullWidth loading={isPending}>Simpan Perubahan</Button>
      </div>
    </form>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

interface CreateProps {
  mode: "create";
  defaultValues?: undefined;
  onSubmit: (values: StaffCreateFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

interface EditProps {
  mode: "edit";
  defaultValues: Partial<StaffEditFormValues>;
  onSubmit: (values: StaffEditFormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export function StaffFormModal(props: CreateProps | EditProps) {
  const { mode, onClose } = props;

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title={mode === "create" ? "Tambah Karyawan" : "Edit Karyawan"} onClose={onClose} />
      {mode === "create" ? (
        <CreateForm onSubmit={props.onSubmit} onClose={onClose} isPending={props.isPending} />
      ) : (
        <EditForm
          defaultValues={props.defaultValues}
          onSubmit={props.onSubmit}
          onClose={onClose}
          isPending={props.isPending}
        />
      )}
    </ModalWrapper>
  );
}

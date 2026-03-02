"use client";

import {
  useFieldArray,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { Service } from "@/types";
import type { CreateOrderInput } from "@/schemas/order";

export interface ServiceItemsFieldErrors {
  items?: {
    message?: string;
  } & Record<
    number,
    {
      serviceId?: { message?: string };
      qty?: { message?: string };
      pricePerUnit?: { message?: string };
    }
  >;
}

interface ServiceItemsFieldProps {
  services: Service[];
  errors?: ServiceItemsFieldErrors;
}

const selectStyle: React.CSSProperties = {
  height: 44,
  padding: "0 12px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
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

const numberInputStyle: React.CSSProperties = {
  height: 44,
  padding: "0 12px",
  borderRadius: 10,
  border: "1.5px solid #E8EDF2",
  background: "white",
  fontFamily: "Nunito Sans, system-ui",
  fontWeight: 500,
  fontSize: "0.8125rem",
  color: "#0B1D35",
  outline: "none",
  width: "100%",
  textAlign: "right" as const,
};

function ServiceSelectField({
  index,
  services,
  error,
}: {
  index: number;
  services: Service[];
  error?: string;
}) {
  const { control, setValue } = useFormContext<CreateOrderInput>();
  const { field } = useController({
    control,
    name: `items.${index}.serviceId`,
  });

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const serviceId = e.target.value;
    field.onChange(serviceId);
    const svc = services.find((s) => s.id === serviceId);
    if (svc) {
      setValue(`items.${index}.pricePerUnit`, svc.pricePerUnit);
    }
  }

  return (
    <div>
      <select
        {...field}
        onChange={handleChange}
        style={{ ...selectStyle, borderColor: error ? "#EF2D56" : "#E8EDF2" }}
      >
        <option value="">-- Pilih layanan --</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} · Rp {s.pricePerUnit.toLocaleString("id-ID")}/{s.unit}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.7rem", color: "#EF2D56", marginTop: 3 }}>
          {error}
        </p>
      )}
    </div>
  );
}

function NumberField({
  name,
  step,
  min,
  error,
}: {
  name: `items.${number}.qty` | `items.${number}.pricePerUnit`;
  step?: string;
  min?: string;
  error?: string;
}) {
  const { control } = useFormContext<CreateOrderInput>();
  const { field } = useController({ control, name });

  return (
    <div>
      <input
        type="number"
        step={step}
        min={min}
        value={field.value as number}
        onChange={(e) => field.onChange(e.target.valueAsNumber)}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        style={{ ...numberInputStyle, borderColor: error ? "#EF2D56" : "#E8EDF2" }}
      />
      {error && (
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.7rem", color: "#EF2D56", marginTop: 3 }}>
          {error}
        </p>
      )}
    </div>
  );
}

function ServiceItemRow({
  index,
  services,
  onRemove,
  canRemove,
  rowErrors,
}: {
  index: number;
  services: Service[];
  onRemove: () => void;
  canRemove: boolean;
  rowErrors?: {
    serviceId?: { message?: string };
    qty?: { message?: string };
    pricePerUnit?: { message?: string };
  };
}) {
  const { control } = useFormContext<CreateOrderInput>();
  const items = useWatch({ control, name: "items" });
  const item = items?.[index];
  const selectedService = services.find((s) => s.id === item?.serviceId);

  const qty = Number(item?.qty ?? 0);
  const price = Number(item?.pricePerUnit ?? 0);
  const subtotal = qty * price;

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: "#F8FAFC", border: "1px solid #E8EDF2" }}
    >
      <div
        className="grid gap-3 items-end"
        style={{ gridTemplateColumns: "1fr 90px 150px 36px" }}
      >
        {/* Service selector */}
        <div className="flex flex-col gap-1">
          <label
            style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.68rem", color: "#8899AA", letterSpacing: "0.04em" }}
          >
            LAYANAN
          </label>
          <ServiceSelectField index={index} services={services} error={rowErrors?.serviceId?.message} />
        </div>

        {/* Qty */}
        <div className="flex flex-col gap-1">
          <label
            style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.68rem", color: "#8899AA", letterSpacing: "0.04em" }}
          >
            QTY{selectedService ? ` (${selectedService.unit})` : ""}
          </label>
          <NumberField name={`items.${index}.qty`} step="0.1" min="0.1" error={rowErrors?.qty?.message} />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label
            style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.68rem", color: "#8899AA", letterSpacing: "0.04em" }}
          >
            HARGA/UNIT (Rp)
          </label>
          <NumberField name={`items.${index}.pricePerUnit`} step="500" min="0" error={rowErrors?.pricePerUnit?.message} />
        </div>

        {/* Remove button */}
        <div>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              style={{
                width: 36,
                height: 44,
                borderRadius: 10,
                border: "none",
                background: "rgba(239,45,86,0.08)",
                color: "#EF2D56",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <div style={{ width: 36, height: 44 }} />
          )}
        </div>
      </div>

      {subtotal > 0 && (
        <div className="flex justify-end mt-2">
          <span style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.78rem", color: "#5A6B80" }}>
            Subtotal:{" "}
            <span style={{ color: "#0B1D35" }}>
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export function ServiceItemsField({ services, errors }: ServiceItemsFieldProps) {
  const { control } = useFormContext<CreateOrderInput>();

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const itemErrors = errors?.items;
  const rootMessage =
    itemErrors && typeof itemErrors === "object" && "message" in itemErrors
      ? (itemErrors as { message?: string }).message
      : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label
          style={{ fontFamily: "Manrope, system-ui", fontWeight: 700, fontSize: "0.75rem", color: "#3D5068", letterSpacing: "0.01em" }}
        >
          Pilih Layanan
        </label>
        <button
          type="button"
          onClick={() => append({ serviceId: "", qty: 1, pricePerUnit: 0 })}
          className="flex items-center gap-1.5"
          style={{
            height: 30,
            padding: "0 12px",
            borderRadius: 8,
            border: "1.5px solid #00B4D8",
            background: "rgba(0,180,216,0.06)",
            color: "#00B4D8",
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          <Plus size={13} />
          Tambah Layanan
        </button>
      </div>

      {fields.map((field, index) => {
        const rowErrors =
          itemErrors &&
          !("message" in (itemErrors as object)) &&
          (itemErrors as Record<number, unknown>)[index]
            ? (
                itemErrors as Record<
                  number,
                  {
                    serviceId?: { message?: string };
                    qty?: { message?: string };
                    pricePerUnit?: { message?: string };
                  }
                >
              )[index]
            : undefined;

        return (
          <ServiceItemRow
            key={field.id}
            index={index}
            services={services}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
            rowErrors={rowErrors}
          />
        );
      })}

      {rootMessage && (
        <p style={{ fontFamily: "Nunito Sans, system-ui", fontWeight: 600, fontSize: "0.75rem", color: "#EF2D56" }}>
          {rootMessage}
        </p>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store";
import { CreateOrderForm } from "@/components/orders/CreateOrderForm";

export default function NewOrderPage() {
  const router = useRouter();
  const activeOutletId = useAuthStore((s) => s.activeOutletId);

  if (!activeOutletId) {
    return (
      <div className="flex items-center justify-center" style={{ height: 300 }}>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            color: "#8899AA",
          }}
        >
          Outlet tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1.5px solid #E8EDF2",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#5A6B80",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={17} />
        </button>

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
            <ShoppingBag size={18} color="#00B4D8" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#0B1D35",
                margin: 0,
              }}
            >
              Buat Order Baru
            </h1>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.8rem",
                color: "#8899AA",
                margin: 0,
              }}
            >
              Isi informasi order di bawah
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <CreateOrderForm outletId={activeOutletId} />
    </div>
  );
}

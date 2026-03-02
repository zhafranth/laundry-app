"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Order } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  belum_bayar: "Belum Bayar",
  dp: "DP",
  lunas: "Lunas",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

interface PrintReceiptProps {
  order: Order;
  outletName: string;
  outletAddress?: string | null;
  outletPhone?: string | null;
}

export function PrintReceipt({
  order,
  outletName,
  outletAddress,
  outletPhone,
}: PrintReceiptProps) {
  return (
    <div>
      {/* Print button — hidden on actual print */}
      <div className="flex justify-center mb-6 print:hidden">
        <Button
          variant="primary"
          leftIcon={<Printer size={15} />}
          onClick={() => window.print()}
        >
          Cetak Nota
        </Button>
      </div>

      {/* Receipt */}
      <div
        id="print-area"
        style={{
          maxWidth: 380,
          margin: "0 auto",
          background: "white",
          padding: "24px 20px",
          fontFamily: "monospace",
          fontSize: "13px",
          lineHeight: 1.6,
          border: "1px solid #E8EDF2",
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "#0B1D35",
              margin: 0,
            }}
          >
            {outletName}
          </p>
          {outletAddress && (
            <p style={{ color: "#5A6B80", fontSize: 12, margin: "2px 0 0" }}>
              {outletAddress}
            </p>
          )}
          {outletPhone && (
            <p style={{ color: "#5A6B80", fontSize: 12, margin: 0 }}>
              {outletPhone}
            </p>
          )}
        </div>

        <div
          style={{
            borderTop: "1.5px dashed #C4CDD6",
            borderBottom: "1.5px dashed #C4CDD6",
            padding: "10px 0",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8899AA" }}>No. Order</span>
            <span style={{ fontWeight: 700, color: "#00B4D8" }}>
              {order.orderNumber}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8899AA" }}>Tanggal</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8899AA" }}>Pelanggan</span>
            <span style={{ fontWeight: 700 }}>{order.customer.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#8899AA" }}>HP</span>
            <span>{order.customer.phone}</span>
          </div>
          {order.estimatedFinishedAt && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8899AA" }}>Est. Selesai</span>
              <span>{formatDate(order.estimatedFinishedAt)}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: 12,
              color: "#8899AA",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Detail Layanan
          </p>
          {order.items.map((item) => (
            <div key={item.id} style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: 700, flex: 1 }}>
                  {item.serviceName}
                </span>
                <span style={{ fontWeight: 700 }}>
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
              <p style={{ color: "#8899AA", fontSize: 12, margin: 0 }}>
                {item.qty} {item.unit} × {formatRupiah(item.pricePerUnit)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div
          style={{
            borderTop: "1.5px dashed #C4CDD6",
            paddingTop: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            <span>TOTAL</span>
            <span>{formatRupiah(order.totalAmount)}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <span style={{ color: "#8899AA" }}>Status Bayar</span>
            <span
              style={{
                fontWeight: 700,
                color:
                  order.paymentStatus === "lunas"
                    ? "#00C853"
                    : order.paymentStatus === "dp"
                    ? "#FFB703"
                    : "#EF2D56",
              }}
            >
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </span>
          </div>

          {order.paymentStatus === "dp" && (
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#8899AA" }}>Dibayar (DP)</span>
              <span>{formatRupiah(order.paidAmount)}</span>
            </div>
          )}

          {order.paymentStatus !== "lunas" && order.remainingAmount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
              }}
            >
              <span>Sisa Bayar</span>
              <span style={{ color: "#FFB703" }}>
                {formatRupiah(order.remainingAmount)}
              </span>
            </div>
          )}

          {order.paymentMethod && (
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "#8899AA" }}>Metode</span>
              <span>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 12,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#8899AA",
                margin: "0 0 2px",
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              Catatan
            </p>
            <p style={{ margin: 0, color: "#3D5068", fontSize: 12 }}>
              {order.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: "1.5px dashed #C4CDD6", paddingTop: 10 }}>
          <p style={{ color: "#8899AA", fontSize: 11, margin: 0 }}>
            Terima kasih atas kepercayaan Anda!
          </p>
          <p
            style={{
              color: "#C4CDD6",
              fontSize: 10,
              margin: "4px 0 0",
            }}
          >
            Powered by LaundryKu
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

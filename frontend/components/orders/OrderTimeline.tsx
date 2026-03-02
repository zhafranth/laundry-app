"use client";

import { CheckCircle2, Circle, XCircle, Clock } from "lucide-react";
import type { OrderStatus, OrderStatusHistory } from "@/types";

const STATUS_ORDER: OrderStatus[] = [
  "masuk",
  "proses",
  "siap_diambil",
  "selesai",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  masuk: "Order Masuk",
  proses: "Sedang Diproses",
  siap_diambil: "Siap Diambil",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  overdue: "Overdue",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history: OrderStatusHistory[];
}

export function OrderTimeline({ currentStatus, history }: OrderTimelineProps) {
  const isCancelled = currentStatus === "dibatalkan";

  // Build a map of status → history entry
  const historyMap = new Map<OrderStatus, OrderStatusHistory>();
  history.forEach((h) => historyMap.set(h.status, h));

  const stepsToShow = isCancelled
    ? [...STATUS_ORDER, "dibatalkan" as OrderStatus]
    : STATUS_ORDER;

  const currentIndex = isCancelled
    ? -1
    : STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {stepsToShow.map((step, idx) => {
        const histEntry = historyMap.get(step);
        const isDone = isCancelled
          ? step !== "dibatalkan"
            ? STATUS_ORDER.indexOf(step) <
              STATUS_ORDER.indexOf(
                history.find((h) => STATUS_ORDER.includes(h.status as OrderStatus))
                  ?.status as OrderStatus ?? "masuk"
              )
            : false
          : STATUS_ORDER.indexOf(step) <= currentIndex;

        const isCurrent = !isCancelled && step === currentStatus;
        const isCancelledStep = step === "dibatalkan";

        const isLast = idx === stepsToShow.length - 1;

        let dotColor = "#C4CDD6";
        let Icon = Circle;
        if (isCancelledStep) {
          dotColor = "#EF2D56";
          Icon = XCircle;
        } else if (isDone || isCurrent) {
          dotColor = "#00B4D8";
          Icon = CheckCircle2;
          if (isCurrent && currentStatus !== "selesai") {
            Icon = Clock;
            dotColor = "#00B4D8";
          }
        }

        return (
          <div key={step} className="flex gap-4">
            {/* Dot + line */}
            <div className="flex flex-col items-center" style={{ width: 20, flexShrink: 0 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={20}
                  color={dotColor}
                  fill={isCancelledStep || isDone || isCurrent ? dotColor : "none"}
                  fillOpacity={isCancelledStep ? 0.15 : isDone || isCurrent ? 0.15 : 0}
                />
              </div>
              {!isLast && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background:
                      isDone && !isCancelledStep ? "#00B4D8" : "#E8EDF2",
                    margin: "2px 0",
                    borderRadius: 1,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              style={{
                paddingBottom: isLast ? 0 : 20,
                paddingTop: 1,
                flex: 1,
              }}
            >
              <p
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: isCurrent || isCancelledStep ? 700 : isDone ? 600 : 500,
                  fontSize: "0.8125rem",
                  color: isCancelledStep
                    ? "#EF2D56"
                    : isCurrent
                    ? "#0B1D35"
                    : isDone
                    ? "#3D5068"
                    : "#A0AEBF",
                  margin: 0,
                }}
              >
                {STATUS_LABELS[step]}
                {isCurrent && (
                  <span
                    style={{
                      marginLeft: 8,
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#00B4D8",
                      animation: "pulse 1.5s infinite",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </p>

              {histEntry && (
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.72rem",
                    color: "#8899AA",
                    margin: "2px 0 0",
                  }}
                >
                  {formatDateTime(histEntry.createdAt)}
                  {histEntry.createdByName && ` · ${histEntry.createdByName}`}
                </p>
              )}

              {histEntry?.note && (
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.75rem",
                    color: "#5A6B80",
                    margin: "3px 0 0",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{histEntry.note}&quot;
                </p>
              )}

              {!histEntry && !isDone && !isCurrent && !isCancelledStep && (
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.72rem",
                    color: "#C4CDD6",
                    margin: "2px 0 0",
                  }}
                >
                  Belum
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

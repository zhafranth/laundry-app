"use client";

import { Check, X } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { COMPARISON_FEATURES } from "@/lib/data";

export function ComparisonTable() {
  return (
    <SectionWrapper gray>
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          Bandingkan Paket
        </h2>
        <p
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1rem",
            color: "#5A6B80",
          }}
        >
          Lihat perbandingan detail fitur Regular vs Pro.
        </p>
      </div>

      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl"
        style={{ border: "1.5px solid #E8EDF2", background: "white" }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-3 gap-4 px-6 py-4"
          style={{ background: "#F5F7FA" }}
        >
          <span
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#5A6B80",
            }}
          >
            Fitur
          </span>
          <span
            className="text-center"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "#0B1D35",
            }}
          >
            Regular
          </span>
          <span
            className="text-center"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "#00B4D8",
            }}
          >
            Pro
          </span>
        </div>

        {/* Rows */}
        {COMPARISON_FEATURES.map((feature, idx) => (
          <div
            key={feature.name}
            className="grid grid-cols-3 gap-4 px-6 py-3.5 items-center"
            style={{
              borderTop: "1px solid #F0F3F6",
              background: idx % 2 === 1 ? "#FAFBFC" : "white",
            }}
          >
            <span
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.875rem",
                color: "#3D5068",
              }}
            >
              {feature.name}
            </span>
            <div className="flex justify-center">
              <CellValue value={feature.regular} />
            </div>
            <div className="flex justify-center">
              <CellValue value={feature.pro} />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 700,
          fontSize: "0.8rem",
          color: "#0B1D35",
        }}
      >
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full"
        style={{ background: "rgba(0,200,83,0.1)" }}
      >
        <Check size={14} color="#00C853" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-full"
      style={{ background: "rgba(0,0,0,0.04)" }}
    >
      <X size={14} color="#BCC5D0" strokeWidth={3} />
    </div>
  );
}

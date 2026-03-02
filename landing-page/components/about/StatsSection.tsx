"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { STATS } from "@/lib/data";

export function StatsSection() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-4xl text-center">
        <h2
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          LaundryKu dalam Angka
        </h2>
        <p
          className="mx-auto mb-12 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1rem",
            color: "#5A6B80",
          }}
        >
          Pertumbuhan yang kami capai bersama mitra laundry di seluruh
          Indonesia.
        </p>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl p-6"
              style={{
                border: "1.5px solid #E8EDF2",
                background: "white",
              }}
            >
              <p
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: "#0B1D35",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {stat.value.toLocaleString("id-ID")}
                <span style={{ color: "#00B4D8" }}>{stat.suffix}</span>
              </p>
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.85rem",
                  color: "#8899AA",
                  margin: 0,
                  marginTop: 8,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

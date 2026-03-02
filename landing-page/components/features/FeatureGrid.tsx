"use client";

import { FEATURES_FULL } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const CATEGORIES = ["Operasional", "Keuangan", "Insight Pro"] as const;

export function FeatureGrid() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center mb-14">
        <p
          className="mb-3"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#00B4D8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Fitur Lengkap
        </p>
        <h1
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#0B1D35",
            lineHeight: 1.2,
          }}
        >
          Semua yang Anda Butuhkan,{" "}
          <span style={{ color: "#00B4D8" }}>Satu Platform</span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#5A6B80",
          }}
        >
          12 fitur powerful untuk mengelola operasional, keuangan, dan insight
          bisnis laundry Anda.
        </p>
      </div>

      {CATEGORIES.map((category) => {
        const features = FEATURES_FULL.filter((f) => f.category === category);
        return (
          <div key={category} className="mb-14 last:mb-0">
            <div className="mb-6 flex items-center gap-3">
              <h2
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "#0B1D35",
                }}
              >
                {category}
              </h2>
              {category === "Insight Pro" && (
                <span
                  className="rounded-full px-2.5 py-0.5"
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: "#FFFFFF",
                    background: "#FFB703",
                  }}
                >
                  Pro
                </span>
              )}
              <div className="flex-1 border-b border-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <SpotlightCard
                    key={feature.title}
                    className="rounded-2xl bg-white"
                    style={{ border: "1.5px solid #E8EDF2" }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: feature.pro
                              ? "rgba(255,183,3,0.08)"
                              : "rgba(0,180,216,0.08)",
                          }}
                        >
                          <Icon
                            size={22}
                            color={feature.pro ? "#FFB703" : "#00B4D8"}
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <h3
                        style={{
                          fontFamily: "Manrope, system-ui",
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: "#0B1D35",
                          marginBottom: 8,
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Nunito Sans, system-ui",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: "#5A6B80",
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>
        );
      })}
    </SectionWrapper>
  );
}

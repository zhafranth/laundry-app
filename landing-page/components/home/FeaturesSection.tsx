"use client";

import { FEATURES } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

export function FeaturesSection() {
  return (
    <SectionWrapper id="features">
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center mb-14">
        <h2
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            color: "#0B1D35",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Semua yang Dibutuhkan Bisnis Laundry Anda
        </h2>
        <p
          className="mt-4"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#5A6B80",
            margin: 0,
            marginTop: 16,
          }}
        >
          Dari pencatatan order hingga analisis profit — satu platform untuk
          semua kebutuhan operasional laundry Anda.
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <SpotlightCard
              key={feature.title}
              className="rounded-2xl bg-white"
              style={{
                border: "1.5px solid #E8EDF2",
              }}
            >
              <div className="p-6">
                {/* Icon + Pro badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(0, 180, 216, 0.08)",
                    }}
                  >
                    <Icon size={22} color="#00B4D8" strokeWidth={2} />
                  </div>

                  {feature.pro && (
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5"
                      style={{
                        fontFamily: "Manrope, system-ui",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        color: "#FFFFFF",
                        background: "#FFB703",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Pro
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#0B1D35",
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    color: "#5A6B80",
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

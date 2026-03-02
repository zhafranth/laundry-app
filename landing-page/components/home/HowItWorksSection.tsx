"use client";

import { HOW_IT_WORKS } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function HowItWorksSection() {
  return (
    <SectionWrapper gray>
      {/* Section heading */}
      <div className="mx-auto max-w-2xl text-center mb-16">
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
          Mulai dalam 3 Langkah
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
          Setup cepat, langsung pakai. Tanpa pelatihan ribet.
        </p>
      </div>

      {/* Steps */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connecting dotted line — desktop only */}
        <div
          className="hidden lg:block absolute top-[3rem]"
          style={{
            left: "calc(33.333% / 2 + 2rem)",
            right: "calc(33.333% / 2 + 2rem)",
            height: 0,
            borderTop: "2.5px dashed #D0D8E0",
            zIndex: 0,
          }}
        />

        {HOW_IT_WORKS.map((item) => (
          <div
            key={item.step}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Step number circle */}
            <div
              className="flex items-center justify-center mb-5"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(0, 180, 216, 0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "3rem",
                  color: "#00B4D8",
                  lineHeight: 1,
                }}
              >
                {item.step}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "#0B1D35",
                margin: 0,
                marginBottom: 8,
              }}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className="max-w-xs"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                color: "#5A6B80",
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

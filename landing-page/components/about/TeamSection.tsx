"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TEAM } from "@/lib/data";

export function TeamSection() {
  return (
    <SectionWrapper gray>
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
          Tim di Balik LaundryKu
        </h2>
        <p
          className="mx-auto mb-12 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1rem",
            color: "#5A6B80",
          }}
        >
          Orang-orang yang berdedikasi membangun platform terbaik untuk
          laundry Indonesia.
        </p>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex w-full max-w-xs flex-col items-center rounded-2xl p-8"
              style={{
                border: "1.5px solid #E8EDF2",
                background: "white",
              }}
            >
              {/* Avatar placeholder */}
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #00B4D8, #0077B6)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#0B1D35",
                  marginBottom: 4,
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#00B4D8",
                  marginBottom: 12,
                }}
              >
                {member.role}
              </p>
              <p
                className="text-center"
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  color: "#5A6B80",
                }}
              >
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

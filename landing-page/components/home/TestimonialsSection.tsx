"use client";

import { TESTIMONIALS } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function TestimonialsSection() {
  return (
    <SectionWrapper gray>
      {/* Heading */}
      <h2
        className="mx-auto max-w-3xl text-center"
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 800,
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          color: "#0B1D35",
          lineHeight: 1.2,
          marginBottom: "3rem",
        }}
      >
        Dipercaya Pemilik Laundry di Seluruh Indonesia
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="rounded-2xl bg-white p-6"
            style={{
              border: "1.5px solid #E8EDF2",
            }}
          >
            {/* Quote icon */}
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "2rem",
                lineHeight: 1,
                color: "#00B4D8",
                display: "block",
                marginBottom: "0.75rem",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote text */}
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "1rem",
                color: "#3D5068",
                fontStyle: "italic",
                lineHeight: 1.7,
                margin: 0,
                marginBottom: "1.5rem",
              }}
            >
              {testimonial.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              {/* Avatar with initial */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #00B4D8, #0077B6)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#FFFFFF",
                  }}
                >
                  {testimonial.name.charAt(0)}
                </span>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0B1D35",
                    margin: 0,
                  }}
                >
                  {testimonial.name}
                </p>
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.8rem",
                    color: "#8899AA",
                    margin: 0,
                    marginTop: 2,
                  }}
                >
                  {testimonial.business}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/data";

export function PricingCards() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-4xl text-center">
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
          Harga
        </p>
        <h2
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            color: "#0B1D35",
            marginBottom: 8,
          }}
        >
          Investasi Terbaik untuk Bisnis Anda
        </h2>
        <p
          className="mx-auto mb-12 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1rem",
            color: "#5A6B80",
          }}
        >
          Mulai gratis 14 hari. Tanpa kartu kredit. Upgrade kapan saja.
        </p>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl p-8 text-left"
              style={{
                border: plan.popular
                  ? "2px solid #00B4D8"
                  : "1.5px solid #E8EDF2",
                background: "white",
                boxShadow: plan.popular
                  ? "0 8px 24px rgba(0,180,216,0.12)"
                  : "none",
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1"
                  style={{
                    background: "#00B4D8",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "white",
                  }}
                >
                  Paling Populer
                </div>
              )}

              <h3
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "#0B1D35",
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </h3>
              <p
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontSize: "0.875rem",
                  color: "#5A6B80",
                  marginBottom: 20,
                }}
              >
                {plan.description}
              </p>

              <div className="mb-6 flex items-baseline gap-1">
                <span
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "1rem",
                    color: "#5A6B80",
                  }}
                >
                  Rp
                </span>
                <span
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    color: "#0B1D35",
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.875rem",
                    color: "#8899AA",
                  }}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(0,200,83,0.1)" }}
                    >
                      <Check size={12} color="#00C853" strokeWidth={3} />
                    </div>
                    <span
                      style={{
                        fontFamily: "Nunito Sans, system-ui",
                        fontSize: "0.875rem",
                        color: "#3D5068",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="https://app.laundryku.com/register">
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  fullWidth
                  rightIcon={<ArrowRight size={16} />}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

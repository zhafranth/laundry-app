"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Aurora from "@/components/reactbits/Aurora";
import SplitText from "@/components/reactbits/SplitText";
import { STATS } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Aurora background */}
      <Aurora
        colorStops={["#00B4D8", "#0077B6", "#FFB703"]}
        blend={0.3}
        amplitude={1.2}
        speed={0.6}
        className="opacity-20"
      />

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,251,0.9) 50%, rgba(255,255,255,1) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "rgba(0,180,216,0.08)",
              border: "1px solid rgba(0,180,216,0.15)",
            }}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: "#00B4D8", animation: "pulse-glow 2s ease-in-out infinite" }}
            />
            <span
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: "#00B4D8",
              }}
            >
              Platform #1 untuk Laundry UMKM
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mx-auto max-w-4xl"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.1,
              color: "#0B1D35",
              letterSpacing: "-0.02em",
            }}
          >
            <SplitText
              text="Kelola Cerdas,"
              className="block"
              delay={50}
              animationFrom={{ opacity: 0, transform: "translate3d(0,30px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            />
            <span className="block mt-1">
              <SplitText
                text="Untung"
                delay={50}
                animationFrom={{ opacity: 0, transform: "translate3d(0,30px,0)" }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              />
              {" "}
              <span style={{ color: "#00B4D8" }}>
                <SplitText
                  text="Lebih"
                  delay={50}
                  animationFrom={{ opacity: 0, transform: "translate3d(0,30px,0)" }}
                  animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto mt-6 max-w-2xl"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "#5A6B80",
              animation: "fade-up 0.6s ease 0.3s both",
            }}
          >
            Dashboard manajemen laundry terlengkap. Catat order, kelola
            keuangan, dan dapatkan insight bisnis cerdas — semua dalam satu
            platform.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            style={{ animation: "fade-up 0.6s ease 0.5s both" }}
          >
            <Link href="https://app.laundryku.com/register">
              <Button
                size="lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" size="lg" leftIcon={<Play size={16} />}>
                Lihat Demo
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-10"
            style={{ animation: "fade-up 0.6s ease 0.7s both" }}
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "1.75rem",
                    color: "#0B1D35",
                    margin: 0,
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
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

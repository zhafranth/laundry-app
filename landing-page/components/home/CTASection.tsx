"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#0B1D35" }}
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute left-1/4 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,183,3,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h2
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "white",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Siap Kelola Laundry{" "}
          <span style={{ color: "#00B4D8" }}>Lebih Cerdas?</span>
        </h2>
        <p
          className="mx-auto max-w-lg"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 32,
          }}
        >
          Bergabung dengan 2.000+ outlet yang sudah menggunakan LaundryKu
          untuk mengelola bisnis mereka.
        </p>

        <Link href="https://app.laundryku.com/register">
          <Button size="lg" rightIcon={<ArrowRight size={18} />}>
            Mulai Gratis Sekarang
          </Button>
        </Link>

        <p
          className="mt-5"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Gratis 14 hari. Tanpa kartu kredit.
        </p>
      </div>
    </section>
  );
}

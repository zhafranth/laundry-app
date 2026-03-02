"use client";

import { Target, Heart } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function VisionSection() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-4xl">
        {/* Section heading */}
        <div className="mb-16 text-center">
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
            Tentang Kami
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
            Membantu UMKM Laundry{" "}
            <span style={{ color: "#00B4D8" }}>Go Digital</span>
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl"
            style={{
              fontFamily: "Nunito Sans, system-ui",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "#5A6B80",
            }}
          >
            LaundryKu lahir dari keprihatinan melihat ribuan pelaku usaha
            laundry di Indonesia yang masih mengelola bisnis secara manual.
            Kami percaya teknologi bisa mengubah cara mereka bekerja.
          </p>
        </div>

        {/* Vision & Mission cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Visi */}
          <div
            className="rounded-2xl p-8"
            style={{ border: "1.5px solid #E8EDF2", background: "white" }}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center"
              style={{
                borderRadius: 12,
                background: "rgba(0,180,216,0.08)",
              }}
            >
              <Target size={22} color="#00B4D8" />
            </div>
            <h3
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.125rem",
                color: "#0B1D35",
                marginBottom: 12,
              }}
            >
              Visi
            </h3>
            <p
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.925rem",
                lineHeight: 1.7,
                color: "#5A6B80",
              }}
            >
              Menjadi platform manajemen laundry #1 di Indonesia yang
              membantu setiap pelaku usaha laundry membuat keputusan bisnis
              berbasis data.
            </p>
          </div>

          {/* Misi */}
          <div
            className="rounded-2xl p-8"
            style={{ border: "1.5px solid #E8EDF2", background: "white" }}
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center"
              style={{
                borderRadius: 12,
                background: "rgba(255,183,3,0.08)",
              }}
            >
              <Heart size={22} color="#FFB703" />
            </div>
            <h3
              style={{
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.125rem",
                color: "#0B1D35",
                marginBottom: 12,
              }}
            >
              Misi
            </h3>
            <ul
              className="space-y-3"
              style={{
                fontFamily: "Nunito Sans, system-ui",
                fontSize: "0.925rem",
                lineHeight: 1.7,
                color: "#5A6B80",
              }}
            >
              <li className="flex items-start gap-2">
                <span style={{ color: "#00B4D8", marginTop: 2 }}>•</span>
                Menyederhanakan operasional harian laundry
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#00B4D8", marginTop: 2 }}>•</span>
                Memberikan insight keuangan yang actionable
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#00B4D8", marginTop: 2 }}>•</span>
                Membuat teknologi accessible untuk semua skala usaha
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

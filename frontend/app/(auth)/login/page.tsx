"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { OwnerLoginForm } from "@/components/auth/OwnerLoginForm";
import { StaffLoginForm } from "@/components/auth/StaffLoginForm";

type Tab = "owner" | "staff";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>("owner");

  return (
    <AuthLayout
      title={activeTab === "owner" ? "Selamat datang kembali" : "Masuk sebagai Staff"}
      subtitle={
        activeTab === "owner"
          ? "Masukkan email dan password untuk mengakses dashboard"
          : "Masukkan username dan PIN 6 digit kamu"
      }
    >
      {/* ── Tab Switcher ── */}
      <div
        className="relative flex mb-6 p-1 rounded-[14px]"
        style={{ background: "#F0F4F8", border: "1px solid #E8EDF2" }}
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-[10px] transition-all duration-200"
          style={{
            width: "calc(50% - 4px)",
            left: activeTab === "owner" ? 4 : "calc(50%)",
            background: "white",
            boxShadow: "0 1px 4px rgba(11,29,53,0.10)",
          }}
        />
        {(["owner", "staff"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="relative z-10 flex-1 py-2.5 text-sm rounded-[10px] transition-colors capitalize"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 700,
              color: activeTab === tab ? "#0B1D35" : "#8899AA",
              cursor: "pointer",
              border: "none",
              background: "transparent",
            }}
          >
            {tab === "owner" ? "Owner" : "Staff"}
          </button>
        ))}
      </div>

      {/* ── Form (swap with animation) ── */}
      <div
        key={activeTab}
        style={{ animation: "slide-right 0.2s ease forwards" }}
      >
        {activeTab === "owner" ? <OwnerLoginForm /> : <StaffLoginForm />}
      </div>
    </AuthLayout>
  );
}

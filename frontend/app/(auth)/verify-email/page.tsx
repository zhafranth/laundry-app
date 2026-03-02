"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Mail, RotateCcw, CheckCircle } from "lucide-react";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await authService.resendVerification(email);
      setResent(true);
    } catch {
      setError("Gagal mengirim ulang. Coba lagi dalam beberapa saat.");
    } finally {
      setLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, "$1•••$2")
    : "email kamu";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FAFBFC" }}
    >
      <div
        className="w-full max-w-[440px] text-center"
        style={{ animation: "fade-up 0.35s ease forwards" }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-[24px] mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #E0F7FA, #B3EAF5)",
            boxShadow: "0 8px 24px rgba(0,180,216,0.15)",
          }}
        >
          <Mail size={36} strokeWidth={1.5} style={{ color: "#00B4D8" }} />
        </div>

        {/* Heading */}
        <h1
          className="mb-2"
          style={{
            color: "#0B1D35",
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "1.5rem",
          }}
        >
          Cek email kamu
        </h1>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
        >
          Kami mengirim link verifikasi ke{" "}
          <span style={{ color: "#0B1D35", fontWeight: 700, fontFamily: "Manrope, system-ui" }}>
            {maskedEmail}
          </span>
          . Klik link tersebut untuk mengaktifkan akunmu.
        </p>

        {/* Success state */}
        {resent && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-[12px] mb-4 text-sm"
            style={{
              background: "rgba(0,200,83,0.06)",
              border: "1px solid rgba(0,200,83,0.2)",
            }}
          >
            <CheckCircle size={16} style={{ color: "#00C853", flexShrink: 0 }} />
            <span
              style={{ color: "#00C853", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}
            >
              Email verifikasi berhasil dikirim ulang!
            </span>
          </div>
        )}

        {error && (
          <div
            className="px-4 py-3 rounded-[12px] mb-4 text-sm"
            style={{
              background: "rgba(239,45,86,0.06)",
              border: "1px solid rgba(239,45,86,0.2)",
              color: "#EF2D56",
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            fullWidth
            loading={loading}
            onClick={handleResend}
            leftIcon={<RotateCcw size={15} />}
          >
            Kirim ulang email
          </Button>

          <Link href="/login" className="w-full">
            <Button variant="ghost" fullWidth>
              Kembali ke halaman masuk
            </Button>
          </Link>
        </div>

        <p
          className="text-xs mt-8"
          style={{ color: "#C4CDD6", fontFamily: "Nunito Sans, system-ui" }}
        >
          Email tidak masuk? Cek folder Spam atau Promosi
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

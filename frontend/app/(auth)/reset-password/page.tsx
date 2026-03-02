"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError("root", { message: "Link reset tidak valid. Minta link baru." });
      return;
    }
    try {
      await authService.resetPassword(token, data.password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Gagal reset password. Link mungkin sudah kadaluarsa.";
      setError("root", { message: msg });
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password berhasil diubah" subtitle="" backToLogin>
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-[20px] mx-auto mb-5 flex items-center justify-center"
            style={{
              background: "rgba(0,200,83,0.08)",
              border: "1px solid rgba(0,200,83,0.2)",
            }}
          >
            <CheckCircle size={32} strokeWidth={1.5} style={{ color: "#00C853" }} />
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#5A6B80", fontFamily: "Nunito Sans, system-ui" }}
          >
            Password kamu berhasil diubah. Kamu akan diarahkan ke halaman masuk...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout title="Link tidak valid" subtitle="" backToLogin>
        <div
          className="px-4 py-4 rounded-[12px] text-sm text-center"
          style={{
            background: "rgba(239,45,86,0.06)",
            border: "1px solid rgba(239,45,86,0.2)",
            color: "#EF2D56",
            fontFamily: "Nunito Sans, system-ui",
            fontWeight: 600,
          }}
        >
          Link reset password tidak valid atau sudah kadaluarsa.{" "}
          <Link
            href="/forgot-password"
            style={{ color: "#EF2D56", textDecoration: "underline" }}
          >
            Minta link baru
          </Link>
          .
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Buat password baru"
      subtitle="Pastikan password baru kamu kuat dan mudah diingat"
      backToLogin
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <PasswordInput
          {...register("password")}
          label="Password Baru"
          placeholder="Min. 8 karakter, huruf kapital & angka"
          autoComplete="new-password"
          showStrength
          value={watch("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          {...register("confirmPassword")}
          label="Konfirmasi Password Baru"
          placeholder="Ulangi password baru"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {errors.root && (
          <div
            className="px-4 py-3 rounded-[10px] text-sm"
            style={{
              background: "rgba(239,45,86,0.06)",
              border: "1px solid rgba(239,45,86,0.2)",
              color: "#EF2D56",
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 600,
            }}
          >
            {errors.root.message}
          </div>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} className="mt-1">
          Simpan Password Baru
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

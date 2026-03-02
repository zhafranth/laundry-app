"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, CheckCircle } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await authService.forgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Gagal mengirim email reset. Coba lagi.";
      setError("root", { message: msg });
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Email terkirim!" subtitle="" backToLogin>
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
            Link reset password telah dikirim ke{" "}
            <span
              style={{ color: "#0B1D35", fontWeight: 700, fontFamily: "Manrope, system-ui" }}
            >
              {sentEmail}
            </span>
            . Cek inbox atau folder Spam kamu.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Lupa password?"
      subtitle="Masukkan email akunmu dan kami akan kirimkan link untuk reset password"
      backToLogin
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          {...register("email")}
          label="Email"
          type="email"
          placeholder="email@laundryku.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
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
          Kirim Link Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Pendaftaran gagal. Coba lagi.";
      setError("root", { message: msg });
    }
  };

  return (
    <AuthLayout
      title="Daftar akun LaundryKu"
      subtitle="Mulai kelola laundrymu lebih cerdas — gratis 14 hari"
      backToLogin
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          {...register("name")}
          label="Nama Lengkap"
          placeholder="Budi Santoso"
          autoComplete="name"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
        />

        <Input
          {...register("email")}
          label="Email"
          type="email"
          placeholder="email@laundryku.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
        />

        <Input
          {...register("phone")}
          label="Nomor HP"
          type="tel"
          placeholder="08123456789"
          autoComplete="tel"
          leftIcon={<Phone size={16} />}
          error={errors.phone?.message}
          hint="Akan digunakan untuk verifikasi akun"
        />

        <PasswordInput
          {...register("password")}
          label="Password"
          placeholder="Min. 8 karakter, huruf kapital & angka"
          autoComplete="new-password"
          showStrength
          value={watch("password")}
          error={errors.password?.message}
        />

        <PasswordInput
          {...register("confirmPassword")}
          label="Konfirmasi Password"
          placeholder="Ulangi password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {/* Terms */}
        <label
          className="flex items-start gap-2.5 cursor-pointer select-none mt-1"
          style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80" }}
        >
          <input
            {...register("agreeToTerms")}
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded shrink-0 accent-[#00B4D8] cursor-pointer"
          />
          <span>
            Saya menyetujui{" "}
            <Link
              href="/terms"
              className="font-[700] hover:underline"
              style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui" }}
            >
              Syarat & Ketentuan
            </Link>{" "}
            serta{" "}
            <Link
              href="/privacy"
              className="font-[700] hover:underline"
              style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui" }}
            >
              Kebijakan Privasi
            </Link>{" "}
            LaundryKu
          </span>
        </label>
        {errors.agreeToTerms && (
          <p
            className="text-xs -mt-2"
            style={{ color: "#EF2D56", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}
          >
            {errors.agreeToTerms.message}
          </p>
        )}

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
          Buat Akun Gratis
        </Button>
      </form>
    </AuthLayout>
  );
}

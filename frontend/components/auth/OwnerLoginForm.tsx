

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { loginOwnerSchema, type LoginOwnerInput } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

export function OwnerLoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginOwnerInput>({
    resolver: zodResolver(loginOwnerSchema),
  });

  const onSubmit = async (data: LoginOwnerInput) => {
    try {
      const res = await authService.loginOwner(data);
      setAuth({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Email atau password salah";
      setError("root", { message: msg });
    }
  };

  return (
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

      <PasswordInput
        {...register("password")}
        label="Password"
        placeholder="Masukkan password"
        autoComplete="current-password"
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between mt-1">
        <label
          className="flex items-center gap-2 cursor-pointer select-none"
          style={{ fontFamily: "Nunito Sans, system-ui", fontSize: "0.8rem", color: "#5A6B80" }}
        >
          <input
            {...register("rememberMe")}
            type="checkbox"
            className="w-4 h-4 rounded accent-[#00B4D8] cursor-pointer"
          />
          Ingat saya
        </label>
        <Link
          to="/forgot-password"
          className="text-xs font-[700] transition-colors hover:underline"
          style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui" }}
        >
          Lupa password?
        </Link>
      </div>

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
        Masuk sebagai Owner
      </Button>

      <p
        className="text-center text-sm mt-1"
        style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
      >
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="font-[700] hover:underline transition-colors"
          style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui" }}
        >
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}

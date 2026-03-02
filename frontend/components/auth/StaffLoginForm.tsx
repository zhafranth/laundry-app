
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { loginStaffSchema, type LoginStaffInput } from "@/schemas/auth";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store";
import { Input } from "@/components/ui/Input";
import { PinInput } from "@/components/ui/PinInput";
import { Button } from "@/components/ui/Button";

export function StaffLoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginStaffInput>({
    resolver: zodResolver(loginStaffSchema),
    defaultValues: { pin: "" },
  });

  const onSubmit = async (data: LoginStaffInput) => {
    try {
      const res = await authService.loginStaff(data);
      setAuth({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Username atau PIN tidak valid";
      setError("root", { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Input
        {...register("username")}
        label="Username"
        placeholder="username kamu"
        autoComplete="username"
        leftIcon={<User size={16} />}
        error={errors.username?.message}
      />

      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            color: errors.pin ? "#EF2D56" : "#3D5068",
            letterSpacing: "0.01em",
          }}
        >
          PIN 6 Digit
        </label>
        <Controller
          name="pin"
          control={control}
          render={({ field: { onChange, value } }) => (
            <PinInput value={value} onChange={onChange} error={errors.pin?.message} />
          )}
        />
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

      <Button type="submit" fullWidth loading={isSubmitting}>
        Masuk sebagai Staff
      </Button>

      <p
        className="text-center text-xs"
        style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
      >
        Hubungi owner laundrymu jika lupa PIN
      </p>
    </form>
  );
}

"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  hint?: string;
  showStrength?: boolean;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "#E8EDF2" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Lemah", color: "#EF2D56" };
  if (score === 2) return { score, label: "Sedang", color: "#FF6B35" };
  if (score === 3) return { score, label: "Kuat", color: "#FFB703" };
  return { score, label: "Sangat Kuat", color: "#00C853" };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, error, hint, showStrength = false, value, ...rest }, ref) {
    const [show, setShow] = useState(false);
    const strength = showStrength ? getStrength(String(value ?? "")) : null;

    return (
      <div className="flex flex-col gap-1.5">
        <Input
          ref={ref}
          label={label}
          error={error}
          hint={hint}
          type={show ? "text" : "password"}
          value={value}
          rightIcon={show ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShow((v) => !v)}
          {...rest}
        />

        {showStrength && value && (
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      (strength?.score ?? 0) >= i ? strength?.color : "#E8EDF2",
                  }}
                />
              ))}
            </div>
            {strength?.label && (
              <span
                className="text-xs shrink-0"
                style={{
                  fontFamily: "Nunito Sans, system-ui",
                  fontWeight: 700,
                  color: strength.color,
                }}
              >
                {strength.label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

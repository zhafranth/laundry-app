"use client";

import { ClipboardEvent, KeyboardEvent, useRef } from "react";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  length?: number;
}

export function PinInput({ value, onChange, error, disabled, length = 6 }: PinInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusBox = (index: number) => {
    const inputs = containerRef.current?.querySelectorAll<HTMLInputElement>("input");
    inputs?.[index]?.focus();
  };

  const handleChange = (index: number, inputChar: string) => {
    if (!/^\d$/.test(inputChar)) return;
    const newValue = value.slice(0, index) + inputChar + value.slice(index + 1);
    onChange(newValue.slice(0, length));
    if (index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[index]) {
        const newValue = value.slice(0, index) + value.slice(index + 1);
        onChange(newValue);
      } else if (index > 0) {
        const newValue = value.slice(0, index - 1) + value.slice(index);
        onChange(newValue);
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    focusBox(Math.min(pasted.length, length - 1));
  };

  return (
    <div>
      <div ref={containerRef} className="flex gap-2.5">
        {digits.map((digit, i) => (
          <input
            key={i}
            type="password"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoComplete="one-time-code"
            className="flex-1 h-14 text-center text-xl outline-none rounded-[12px] transition-all duration-150"
            style={{
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
              color: "#0B1D35",
              background: digit ? "rgba(0,180,216,0.04)" : "white",
              border: `2px solid ${error ? "#EF2D56" : digit ? "#00B4D8" : "#E8EDF2"}`,
              caretColor: "transparent",
              animation: digit ? "pin-pop 0.12s ease" : "none",
            }}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? "#EF2D56" : "#00B4D8";
              e.currentTarget.style.boxShadow = error
                ? "0 0 0 3px rgba(239,45,86,0.12)"
                : "0 0 0 3px rgba(0,180,216,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? "#EF2D56"
                : digit
                  ? "#00B4D8"
                  : "#E8EDF2";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        ))}
      </div>
      {error && (
        <p
          className="mt-2 text-xs"
          style={{ color: "#EF2D56", fontFamily: "Nunito Sans, system-ui", fontWeight: 600 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

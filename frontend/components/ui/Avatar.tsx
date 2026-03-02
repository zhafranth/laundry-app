"use client";

type AvatarSize = "xs" | "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CONFIG: Record<AvatarSize, { px: number; fontSize: string; fontWeight: number }> = {
  xs: { px: 28, fontSize: "0.625rem", fontWeight: 700 },
  sm: { px: 32, fontSize: "0.75rem", fontWeight: 700 },
  md: { px: 40, fontSize: "0.875rem", fontWeight: 700 },
  lg: { px: 48, fontSize: "1rem", fontWeight: 800 },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const { px, fontSize, fontWeight } = SIZE_CONFIG[size];
  const initials = getInitials(name);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 select-none ${className}`}
      style={{
        width: px,
        height: px,
        background: "linear-gradient(135deg, #00B4D8, #0077B6)",
        color: "white",
        fontSize,
        fontWeight,
        fontFamily: "Manrope, system-ui",
        letterSpacing: "0.03em",
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

import { Link } from "react-router-dom";

type LogoTheme = "dark" | "light";
type LogoSize = "sm" | "md";

interface BrandLogoProps {
  theme?: LogoTheme;
  size?: LogoSize;
  href?: string;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { container: 28, icon: 12, fontSize: "0.9rem" },
  md: { container: 32, icon: 15, fontSize: "1.1rem" },
};

function BrandIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path
        d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6"
        stroke="#FFB703"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4" />
    </svg>
  );
}

export function BrandLogo({ theme = "dark", size = "md", href = "/", className = "" }: BrandLogoProps) {
  const { container, icon, fontSize } = SIZE_CONFIG[size];
  const textColor = theme === "dark" ? "white" : "#0B1D35";
  const radius = size === "sm" ? "0.625rem" : "0.75rem";

  return (
    <Link to={href} className={`inline-flex items-center gap-2.5 group ${className}`}>
      <div
        className="flex items-center justify-center flex-shrink-0 transition-opacity group-hover:opacity-90"
        style={{
          width: container,
          height: container,
          borderRadius: radius,
          background: "linear-gradient(135deg, #00B4D8, #0077B6)",
        }}
      >
        <BrandIcon size={icon} />
      </div>
      <span
        style={{
          color: textColor,
          fontFamily: "Manrope, system-ui",
          fontWeight: 800,
          fontSize,
        }}
      >
        Laundry
        <span style={{ color: "#00B4D8" }}>Ku</span>
      </span>
    </Link>
  );
}

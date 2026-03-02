interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  light?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  light = false,
  className = "",
}: BrandLogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };
  const boxSizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const s = iconSizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${boxSizes[size]} flex items-center justify-center rounded-xl`}
        style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}
      >
        <svg
          width={s * 0.55}
          height={s * 0.55}
          viewBox="0 0 52 52"
          fill="none"
        >
          <path
            d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6"
            stroke="#FFB703"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
          <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="4" />
        </svg>
      </div>
      {showText && (
        <span
          className={`${textSizes[size]} font-extrabold`}
          style={{
            fontFamily: "var(--font-heading)",
            color: light ? "#FFFFFF" : "#0B1D35",
          }}
        >
          Laundry<span className="text-primary-500">Ku</span>
        </span>
      )}
    </div>
  );
}

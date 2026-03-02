interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const styles = {
    primary: "bg-primary-500/10 text-primary-500",
    secondary: "bg-secondary-500/10 text-secondary-500",
    outline: "border border-gray-300 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {children}
    </span>
  );
}

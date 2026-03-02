"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span
      className={`relative inline-block ${className}`}
    >
      {showBorder && (
        <span
          className="pointer-events-none absolute inset-0 z-0 animate-gradient rounded-[1.25rem] p-[1.5px]"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
            backgroundSize: "300% 100%",
            animationDuration: `${animationSpeed}s`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      <span
        className="relative z-10 inline-block animate-gradient bg-clip-text text-transparent"
        style={gradientStyle}
      >
        {children}
      </span>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient linear infinite;
        }
      `}</style>
    </span>
  );
};

export default GradientText;

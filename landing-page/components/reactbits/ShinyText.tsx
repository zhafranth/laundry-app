"use client";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  return (
    <span
      className={`inline-block bg-clip-text ${
        disabled ? "" : "animate-shiny-text"
      } bg-[linear-gradient(120deg,rgba(255,255,255,0)_40%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_60%)] bg-[length:200%_100%] text-[#b5b5b5a4] ${className}`}
      style={{
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`,
      }}
    >
      {text}
      <style jsx global>{`
        @keyframes shiny-text {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: -100% 50%;
          }
        }
        .animate-shiny-text {
          animation: shiny-text linear infinite;
        }
      `}</style>
    </span>
  );
};

export default ShinyText;

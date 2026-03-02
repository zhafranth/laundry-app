
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  /** Show back-to-login link at the bottom */
  backToLogin?: boolean;
}

const STATS = [
  { value: "2.000+", label: "Outlet Aktif" },
  { value: "150rb+", label: "Order/bulan" },
  { value: "99.9%", label: "Uptime" },
];

/* ── Left Panel Brand SVG Logo ── */
function BrandIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path
        d="M26 6C15 6 8 14 8 24C8 34 15 42 26 42"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26 42C37 42 44 34 44 24C44 14 37 6 26 6"
        stroke="#FFB703"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      <circle cx="26" cy="24" r="8" stroke="white" strokeWidth="3" />
      <path
        d="M22 24C22 21 24 19 26 19"
        stroke="#FFB703"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Animated Concentric Rings (Washing Machine Drum Motif) ── */
function DrumRings() {
  return (
    <div
      className="absolute"
      style={{
        top: "44%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 420,
        height: 420,
        pointerEvents: "none",
      }}
    >
      {/* Ring 1 — slowest, clockwise, very faint */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(0,180,216,0.10)",
          animation: "spin-cw 50s linear infinite",
        }}
      >
        <span
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: "#FFB703",
            opacity: 0.6,
            top: "50%",
            right: -4,
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* Ring 2 — slow, counter-clockwise, dashed */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 42,
          border: "1px dashed rgba(0,180,216,0.18)",
          animation: "spin-ccw 34s linear infinite",
        }}
      />

      {/* Ring 3 — medium, clockwise, solid */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 84,
          border: "1.5px solid rgba(0,180,216,0.26)",
          animation: "spin-cw 22s linear infinite",
        }}
      >
        <span
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: "#00B4D8",
            opacity: 0.7,
            top: -3,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Ring 4 — faster, counter-clockwise */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 126,
          border: "2px solid rgba(0,180,216,0.32)",
          animation: "spin-ccw 14s linear infinite",
        }}
      />

      {/* Core glow orb */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: 168,
          background: "rgba(0,180,216,0.07)",
          border: "1.5px solid rgba(0,180,216,0.35)",
          boxShadow: "0 0 48px rgba(0,180,216,0.18), inset 0 0 24px rgba(0,180,216,0.08)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      >
        <BrandIcon size={44} />
      </div>
    </div>
  );
}

export function AuthLayout({ children, title, subtitle, backToLogin }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ════════════════════════════════════════
          LEFT — Brand Panel (desktop only)
      ════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex lg:w-[42%] relative flex-col justify-between overflow-hidden"
        style={{ background: "#0B1D35" }}
      >
        {/* Radial ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 38%, rgba(0,180,216,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Animated rings */}
        <DrumRings />

        {/* ── Top: Logo link ── */}
        <div className="relative z-10 p-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-opacity group-hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}
            >
              <svg width="15" height="15" viewBox="0 0 52 52" fill="none" aria-hidden="true">
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
            </div>
            <span
              style={{
                color: "white",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.1rem",
              }}
            >
              Laundry
              <span style={{ color: "#00B4D8" }}>Ku</span>
            </span>
          </Link>
        </div>

        {/* ── Middle: Tagline ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 text-center">
          <p
            className="text-3xl mb-3 leading-tight"
            style={{
              color: "white",
              fontFamily: "Manrope, system-ui",
              fontWeight: 800,
            }}
          >
            Kelola Cerdas,
            <br />
            <span style={{ color: "#00B4D8" }}>Untung Lebih</span>
          </p>
          <p
            className="text-sm leading-relaxed max-w-[260px]"
            style={{
              color: "#6B7E93",
              fontFamily: "Nunito Sans, system-ui",
              fontWeight: 400,
            }}
          >
            Dashboard manajemen laundry modern untuk UMKM Indonesia — order, keuangan,
            karyawan, semuanya dalam satu tempat.
          </p>
        </div>

        {/* ── Bottom: Stats ── */}
        <div className="relative z-10 p-8">
          <div
            className="flex justify-center gap-1 mb-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24 }}
          >
            {STATS.map((s, idx) => (
              <div
                key={s.label}
                className="flex-1 text-center"
                style={{
                  borderRight:
                    idx < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: "#4A5E72",
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.7rem",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          RIGHT — Form Panel
      ════════════════════════════════════════ */}
      <main
        className="flex-1 flex items-center justify-center overflow-y-auto"
        style={{ background: "#FAFBFC" }}
      >
        <div
          className="w-full max-w-[460px] px-6 py-12 lg:py-16"
          style={{ animation: "fade-up 0.35s ease forwards" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00B4D8, #0077B6)" }}
            >
              <BrandIcon size={13} />
            </div>
            <span
              style={{
                color: "#0B1D35",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1rem",
              }}
            >
              Laundry
              <span style={{ color: "#00B4D8" }}>Ku</span>
            </span>
          </div>

          {/* Title */}
          <div className="mb-7">
            <h1
              className="mb-1.5"
              style={{
                color: "#0B1D35",
                fontFamily: "Manrope, system-ui",
                fontWeight: 800,
                fontSize: "1.5rem",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-sm"
                style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {children}

          {backToLogin && (
            <p
              className="text-center mt-6 text-sm"
              style={{ color: "#8899AA", fontFamily: "Nunito Sans, system-ui" }}
            >
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-[700] transition-colors hover:underline"
                style={{ color: "#00B4D8", fontFamily: "Manrope, system-ui" }}
              >
                Masuk sekarang
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
